import { PrismaClient } from "@prisma/client";
import { responseError } from "../error/responseError";
import { MINIO_ENDPOINT, MINIO_PORT, minioClient } from "../helper/minioClient";
import { CreateSuratkeluarRequest, SuratkeluarResponse } from "../model/suratkeluarModel";
import { suratkeluarValidation } from "../validation/suratkeluarValidation";
import { Validation } from "../validation/validation";
import { v4 as uuidv4 } from 'uuid';


const prismaClient = new PrismaClient();

export class SuratKeluarService {
    static async createSuratkeluar(
        request: CreateSuratkeluarRequest,
        file: Express.Multer.File,
        userId: string
    ): Promise<SuratkeluarResponse> {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new responseError(404, `User with ID ${userId} not found`);
        }

        const modifiedRequest = {
            ...request,
            user_id: userId,
            tanggal_surat:
                typeof request.tanggal_surat === "string"
                    ? new Date(request.tanggal_surat).toISOString()
                    : new Date(JSON.stringify(request.tanggal_surat)).toISOString(),
        };

        const filename = `${file.originalname}`;
        const bucketName = "suratkeluar";
        const fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucketName}/${filename}`;

        const requestWithFile = {
            ...modifiedRequest,
            gambar: fileUrl,
            user_id: userId,
        };

        console.log("LOG NIE ", request);

        // Validasi request
        const validationRequest = Validation.validate(
            suratkeluarValidation.SuratkeluarValidation,
            requestWithFile
        );

        // Pastikan bucket MinIO ada sebelum menyimpan file
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, "us-east-1");
        }

        await minioClient.putObject(bucketName, filename, file.buffer);

        try {
            // Dapatkan jumlah data saat ini dari NomorSurat
            const countNomorSurat = await prismaClient.nomorSurat.count();
            const newNomorSuratNumber = countNomorSurat + 1;

            // Mendapatkan bulan dan tahun saat ini dalam format yang diinginkan
            const now = new Date();
            const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Format bulan jadi 2 digit
            const year = now.getFullYear().toString().slice(-2); // Ambil 2 digit terakhir tahun

            // Mapping keterangan ke format prefix nomor surat
            const prefixMap: { [key: string]: string } = {
                H: "H",
                SA: "SA",
                SS: "SS",
                P: "P",
                S: "S",
            };

            const prefix = prefixMap[validationRequest.keterangan] || "XX"; // Default "XX" jika tidak cocok

            // Format nomor surat sesuai aturan
            const nomorSuratFormat = `${prefix}/UBL/LAB/${newNomorSuratNumber}/${month}/${year}`;

            // Gunakan transaction untuk memastikan NomorSurat dan SuratKeluar dibuat bersamaan
            const result = await prismaClient.$transaction(async (tx) => {
                // 1. Buat NomorSurat terlebih dahulu
                const nomorSurat = await tx.nomorSurat.create({
                    data: {
                        nomor_surat: nomorSuratFormat,
                        kategori: validationRequest.kategori || "Umum",
                        keterangan: validationRequest.keterangan,
                        deskripsi: "Nomor surat untuk surat keluar",
                    },
                });
            
                // 2. Buat SuratKeluar dengan referensi ke NomorSurat yang baru dibuat
                const suratkeluar = await tx.suratKeluar.create({
                    data: {
                        id: uuidv4(),
                        tanggal_surat: validationRequest.tanggal_surat,
                        tempat_surat: validationRequest.tempat_surat,
                        lampiran: validationRequest.lampiran,
                        isi_surat: validationRequest.isi_surat,
                        penerima: validationRequest.penerima,
                        pengirim: validationRequest.pengirim,
                        jabatan_pengirim: validationRequest.jabatan_pengirim,
                        gambar: validationRequest.gambar,
                        keterangan_gambar: validationRequest.keterangan_gambar,
                        sifat_surat: validationRequest.sifat_surat,
                        user_id: userId,
                        surat_nomor: nomorSuratFormat
                    },
                });
            
                return { nomorSurat, suratkeluar };
            });

            return result.suratkeluar;
        } catch (error) {
            console.error("Error saat membuat surat keluar:", error);
            throw new responseError(500, "Gagal membuat surat keluar");
        }
    }
}
import { PrismaClient } from "@prisma/client";
import { responseError } from "../error/responseError";
import { MINIO_ENDPOINT, MINIO_PORT, minioClient } from "../helper/minioClient";
import { CreateSuratkeluarRequest, SuratkeluarResponse, toSuratkeluarReponse, UpdateSuratkeluarRequest } from "../model/suratkeluarModel";
import { suratkeluarValidation } from "../validation/suratkeluarValidation";
import { Validation } from "../validation/validation";
import { v4 as uuidv4 } from 'uuid';
import { PaginatedResponse } from "../model/suratmasukModel";


const prismaClient = new PrismaClient();

export class SuratKeluarService {
    static async getAllSuratKeluar(
        page: number = 1,
        totalData: number = 10,
        sifat_surat?: string,
    ): Promise<PaginatedResponse<SuratkeluarResponse>> {
        const skip = (page - 1) * totalData;
        const take = totalData;
        const where: any = {};

        if (sifat_surat) {
            where.sifat_surat = {
                contains: sifat_surat,
            };
        }

        const [suratKeluar, totalItems] = await Promise.all([
            prismaClient.suratKeluar.findMany({
                skip,
                take,
                where,
                orderBy: {
                    tanggal_surat: 'desc',
                }
            }),
            prismaClient.suratKeluar.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / totalData);

        return {
            data: suratKeluar.map(sm => toSuratkeluarReponse(sm)),
            meta: {
                currentPage: page,
                offset: skip,
                itemsPerPage: totalData,
                unpaged: false,
                totalPages,
                totalItems,
                sortBy: [],
                filter: {},
            }
        };
    }

    static async getSuratkeluarById(id: string): Promise<SuratkeluarResponse | null> {
        const suratKeluar = await prismaClient.suratKeluar.findUnique({
            where: { id },
        });

        if (suratKeluar) {
            return toSuratkeluarReponse(suratKeluar);
        } else {
            return null
        }
    }

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

            const prefix = prefixMap[validationRequest.keterangan] || "XX";

            // Format nomor surat sesuai aturan
            const nomorSuratFormat = `${prefix}/UBL/LAB/${newNomorSuratNumber}/${month}/${year}`;

            // Gunakan transaction untuk memastikan NomorSurat dan SuratKeluar dibuat bersamaan
            const result = await prismaClient.$transaction(async (tx) => {
                const nomorSurat = await tx.nomorSurat.create({
                    data: {
                        nomor_surat: nomorSuratFormat,
                        kategori: validationRequest.kategori,
                        keterangan: validationRequest.keterangan,
                        deskripsi: validationRequest.deskripsi,
                    },
                });

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

    static async updateSuratkeluar(
        suratKeluarId: string,
        request: UpdateSuratkeluarRequest,
        file?: Express.Multer.File
    ) {
        const existingSuratKeluar = await prismaClient.suratKeluar.findUnique({
            where: { id: suratKeluarId }
        });

        if (!existingSuratKeluar) {
            throw new responseError(404, `Surat Keluar with ID ${suratKeluarId} not found`);
        }

        const validationRequest = Validation.validate(
            suratkeluarValidation.UpdateSuratkeluarValidation,
            request
        );

        // Handle file upload if provided
        let fileUrl = existingSuratKeluar.gambar;
        if (file) {
            const bucketName = "suratkeluar";
            const filename = `${file.originalname}`;

            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, "us-east-1");
            }

            await minioClient.putObject(bucketName, filename, file.buffer);
            fileUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${filename}`;
        }

        const updateData = {
            ...validationRequest,
            gambar: fileUrl
        };

        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const updatedSuratKeluar = await prismaClient.suratKeluar.update({
            where: { id: suratKeluarId },
            data: updateData
        });

        return toSuratkeluarReponse(updatedSuratKeluar);
    }

    static async deleteSuratkeluar(
        id: string
    ): Promise<void> {
        const suratkeluar = await prismaClient.suratKeluar.findUnique({
            where: { id: id },
        });

        if (!suratkeluar) {
            throw new Error(`Surat masuk with ID ${id} not found`);
        }

        await prismaClient.suratKeluar.delete({
            where: { id: id },
        });
    }
}
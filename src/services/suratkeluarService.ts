import { PrismaClient } from "@prisma/client";
import { responseError } from "../error/responseError";
import { MINIO_ENDPOINT, MINIO_PORT, minioClient } from "../helper/minioClient";
import { CreateSuratkeluarRequest, SuratkeluarResponse, toSuratkeluarReponse, UpdateSuratkeluarRequest } from "../model/suratkeluarModel";
import { suratkeluarValidation } from "../validation/suratkeluarValidation";
import { Validation } from "../validation/validation";
import { v4 as uuidv4 } from 'uuid';
import { PaginatedResponse } from "../model/suratmasukModel";


const prismaClient = new PrismaClient();
const BUCKET_NAME = "suratkeluar";
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
                    tanggal: 'desc',
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
        userId: string,
        file?: Express.Multer.File
    ): Promise<SuratkeluarResponse> {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        });
        let fileUrl = ""

        if (!user) {
            throw new responseError(404, `User with ID ${userId} not found`);
        }

        const modifiedRequest = {
            ...request,
            user_id: userId,
            tanggal:
                typeof request.tanggal === "string"
                    ? new Date(request.tanggal).toISOString()
                    : new Date(JSON.stringify(request.tanggal)).toISOString(),
        };

        if (file) {
            const filename = `${file?.originalname}`;
            const bucketName = "suratkeluar";
            fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucketName}/${filename}`;
    
            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, "us-east-1");
            }
    
            await minioClient.putObject(bucketName, filename, file.buffer);
        } 

        const requestWithFile = {
            ...modifiedRequest,
            gambar: fileUrl,
            user_id: userId,
        };

        console.log("LOG NIE ", request);

        const validationRequest = Validation.validate(
            suratkeluarValidation.SuratkeluarValidation,
            requestWithFile
        );

        const kategoriMap: { [key: string]: string } = {
            H: "Perbaikan",
            SA: "Sertifikat Asisten",
            SS: "Sertifikat Webinar",
            P: "Formulir pendaftaran calas",
            S: "SK Asisten",
        };

        const kategori = kategoriMap[validationRequest.keterangan] || "Lainnya";

        try {
            
            const countNomorSurat = await prismaClient.nomorSurat.count();
            const newNomorSuratNumber = (countNomorSurat + 1).toString().padStart(2, '0'); 

            
            const now = new Date();
            const month = (now.getMonth() + 1).toString().padStart(2, "0"); 
            const year = now.getFullYear().toString().slice(-2); 

            const prefixMap: { [key: string]: string } = {
                H: "H",
                SA: "SA",
                SS: "SS",
                P: "P",
                S: "S",
            };

            const prefix = prefixMap[validationRequest.keterangan] || "XX";

            const nomorSuratFormat = `${prefix}/UBL/LAB/${newNomorSuratNumber}/${month}/${year}`;

            const result = await prismaClient.$transaction(async (tx) => {
                const nomorSurat = await tx.nomorSurat.create({
                    data: {
                        nomor_surat: nomorSuratFormat,
                        kategori: kategori, 
                        keterangan: validationRequest.keterangan,
                        deskripsi: validationRequest.deskripsi || "",
                    },
                });

                const suratkeluar = await tx.suratKeluar.create({
                    data: {
                        id: uuidv4(),
                        tanggal: validationRequest.tanggal,
                        tempat_surat: validationRequest.tempat_surat,
                        lampiran: validationRequest.lampiran,
                        isi_surat: validationRequest.isi_surat,
                        penerima: validationRequest.penerima,
                        pengirim: validationRequest.pengirim,
                        jabatan_pengirim: validationRequest.jabatan_pengirim,
                        gambar: validationRequest.gambar || "",
                        keterangan_gambar: validationRequest.keterangan_gambar || "",
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
    ): Promise<SuratkeluarResponse> {
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
            try {
                // Delete existing file first
                if (existingSuratKeluar.gambar) {
                    await this.deleteFileFromMinio(existingSuratKeluar.gambar);
                }

                const filename = `${Date.now()}-${file.originalname}`;
                const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
                if (!bucketExists) {
                    await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
                }

                await minioClient.putObject(BUCKET_NAME, filename, file.buffer);
                fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${filename}`;
            } catch (error) {
                console.error("Error updating file in MinIO:", error);
                throw new responseError(500, "Failed to update file in storage");
            }
        }

        const updateData = {
            ...validationRequest,
            gambar: fileUrl
        };

        // Definisikan mapping keterangan ke prefix
        const prefixMap: { [key: string]: string } = {
            H: "H",
            SA: "SA",
            SS: "SS",
            P: "P",
            S: "S",
        };

        if (validationRequest.keterangan) {
            const newPrefix = prefixMap[validationRequest.keterangan] || "XX";

            // Update hanya bagian prefix dari nomor_surat, format lainnya tetap
            const nomorSuratParts = existingSuratKeluar.surat_nomor.split('/');
            nomorSuratParts[0] = newPrefix;
            updateData.surat_nomor = nomorSuratParts.join('/');

            // Update kategori sesuai keterangan baru
            const kategoriMap: { [key: string]: string } = {
                H: "Perbaikan",
                SA: "Sertifikat Asisten",
                SS: "Sertifikat Webinar",
                P: "Formulir pendaftaran calas",
                S: "SK Asisten",
            };
            updateData.kategori = kategoriMap[validationRequest.keterangan] || "Lainnya";
        }

        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        try {
            const result = await prismaClient.$transaction(async (tx) => {
                const updatedSuratKeluar = await tx.suratKeluar.update({
                    where: { id: suratKeluarId },
                    data: updateData
                });

                if (validationRequest.keterangan) {
                    await tx.nomorSurat.update({
                        where: { nomor_surat: existingSuratKeluar.surat_nomor },
                        data: {
                            keterangan: validationRequest.keterangan,
                            nomor_surat: updateData.surat_nomor,
                            kategori: updateData.kategori,
                        }
                    });
                }

                return updatedSuratKeluar;
            });

            return toSuratkeluarReponse(result);
        } catch (error) {
            // If database transaction fails, delete the newly uploaded file
            if (file && fileUrl !== existingSuratKeluar.gambar) {
                await this.deleteFileFromMinio(fileUrl);
            }
            throw error;
        }
    }

    private static async deleteFileFromMinio(fileUrl: string): Promise<void> {
        try {
            const url = new URL(fileUrl);
            const filePath = url.pathname.split('/').pop();
            if (filePath) {
                await minioClient.removeObject(BUCKET_NAME, filePath);
            }
        } catch (error) {
            console.error("Error deleting file from MinIO:", error);
            throw new responseError(500, "Failed to delete file from storage");
        }
    }


    static async deleteSuratkeluar(id: string): Promise<void> {
        const suratkeluar = await prismaClient.suratKeluar.findUnique({
            where: { id },
        });

        if (!suratkeluar) {
            throw new responseError(404, `Surat keluar with ID ${id} not found`);
        }

        try {
            await prismaClient.$transaction(async (tx) => {
                // Delete the database record first
                await tx.suratKeluar.delete({
                    where: { id },
                });

                // If database deletion is successful, delete the file from MinIO
                if (suratkeluar.gambar) {
                    await this.deleteFileFromMinio(suratkeluar.gambar);
                }
            });
        } catch (error) {
            console.error("Error deleting surat keluar:", error);
            throw new responseError(500, "Failed to delete surat keluar");
        }
    }
}
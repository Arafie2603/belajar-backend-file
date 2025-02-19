import { connect } from "http2";
import { prismaClient } from "../application/database";
import { minioClient, MINIO_ENDPOINT, MINIO_PORT } from "../helper/minioClient";
import { CreateSuratmasukRequest, PaginatedResponse, SuratmasukResponseWithoutDispoisi, toSuratmasukResponseWithoutDisposisi } from "../model/suratmasukModel";
import { suratmasukValidation } from "../validation/suratmasukValidation";
import { Validation } from "../validation/validation";
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'suratmasuk';

export class suratmasukService {
    static async getAllSuratMasuk(
        page: number = 1,
        totalData: number = 10,
        organisasi?: string,
        tujuan?: string,
    ): Promise<PaginatedResponse<SuratmasukResponseWithoutDispoisi>> {
        const skip = (page - 1) * totalData;
        const take = totalData;
        const where: any = {};

        if (organisasi) {
            where.organisasi = {
                contains: organisasi,
            };
        }

        if (tujuan) {
            where.tujuan = {
                contains: tujuan,
            };
        }
        console.log(tujuan);
        const [suratmasuk, totalItems] = await Promise.all([
            prismaClient.suratMasuk.findMany({
                skip,
                take,
                where,
                orderBy: {
                    tanggal: 'desc',
                }
            }),
            prismaClient.suratMasuk.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / totalData);

        return {
            data: suratmasuk.map(sm => toSuratmasukResponseWithoutDisposisi(sm)),
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

    static async getSuratmasukById(no_surat_masuk: string): Promise<SuratmasukResponseWithoutDispoisi | null> {
        const suratmasuk = await prismaClient.suratMasuk.findUnique({
            where: { no_surat_masuk },
        });

        if (suratmasuk) {
            return toSuratmasukResponseWithoutDisposisi(suratmasuk);
        } else {
            return null
        }
    }

    static async createSuratmasuk(
        request: CreateSuratmasukRequest,
        file: Express.Multer.File,
        userId: string
    ): Promise<SuratmasukResponseWithoutDispoisi> {
        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        const modifiedRequest = {
            ...request,
            user_id: userId,
            tanggal: typeof request.tanggal === 'string'
                ? new Date(request.tanggal).toISOString()
                : new Date(JSON.stringify(request.tanggal)).toISOString(),
            expired_data: typeof request.expired_data === 'string'
                ? new Date(request.expired_data).toISOString()
                : new Date(JSON.stringify(request.expired_data)).toISOString()
        }

        let fileUrl = '';
        const filename = `${Date.now()}-${file.originalname}`;

        try {
            const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
            if (!bucketExists) {
                await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
            }

            await minioClient.putObject(BUCKET_NAME, filename, file.buffer);
            fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${filename}`;

            const requestWithFile = {
                ...modifiedRequest,
                scan_surat: fileUrl,
                user_id: userId
            };

            const validationRequest = Validation.validate(
                suratmasukValidation.SuratmasukValidation,
                requestWithFile
            );

            const suratmasuk = await prismaClient.suratMasuk.create({
                data: {
                    no_surat_masuk: uuidv4(),
                    tanggal: validationRequest.tanggal,
                    alamat: validationRequest.alamat,
                    perihal: validationRequest.perihal,
                    tujuan: validationRequest.tujuan,
                    organisasi: validationRequest.organisasi,
                    pengirim: validationRequest.pengirim,
                    penerima: validationRequest.penerima,
                    sifat_surat: validationRequest.sifat_surat,
                    scan_surat: validationRequest.scan_surat,
                    expired_data: validationRequest.expired_data,
                    diteruskan_kepada: request.diteruskan_kepada,
                    tanggal_penyelesaian: request.tanggal_penyelesaian,
                    isi_disposisi: request.isi_disposisi,
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                },
            });

            return suratmasuk;
        } catch (error) {
            // If anything fails, delete the uploaded file if it exists
            if (fileUrl) {
                await this.deleteFileFromMinio(fileUrl);
            }
            throw error;
        }
    }


    static async updateSuratmasuk(
        nomor_surat_masuk: string,
        request: CreateSuratmasukRequest,
        file: Express.Multer.File | null,
        userId: string
    ): Promise<SuratmasukResponseWithoutDispoisi> {
        try {
            const user = await prismaClient.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            const existingSuratMasuk = await prismaClient.suratMasuk.findUnique({
                where: { no_surat_masuk: nomor_surat_masuk }
            });

            if (!existingSuratMasuk) {
                throw new Error(`Surat masuk with ID ${nomor_surat_masuk} not found`);
            }

            const modifiedRequest = {
                ...request,
                user_id: userId,
                tanggal: request.tanggal ? new Date(request.tanggal) : undefined,
                expired_data: request.expired_data ? new Date(request.expired_data) : undefined
            };

            let fileUrl = existingSuratMasuk.scan_surat;

            if (file) {
                try {
                    // Delete existing file first
                    if (existingSuratMasuk.scan_surat) {
                        await this.deleteFileFromMinio(existingSuratMasuk.scan_surat);
                    }

                    const filename = `${Date.now()}-${file.originalname}`;
                    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
                    if (!bucketExists) {
                        await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
                    }

                    await minioClient.putObject(BUCKET_NAME, filename, file.buffer);
                    fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${filename}`;
                } catch (error) {
                    console.error("Error updating file in MinIO:", error);
                    throw new Error("Failed to update file in storage");
                }
            }

            const { user_id, ...updateData } = modifiedRequest;

            // Use transaction to ensure database update and file operations are atomic
            const result = await prismaClient.$transaction(async (tx) => {
                const updatedSuratMasuk = await tx.suratMasuk.update({
                    where: { no_surat_masuk: nomor_surat_masuk },
                    data: {
                        ...updateData,
                        scan_surat: fileUrl,
                        user: { connect: { id: userId } }
                    },
                });
                return updatedSuratMasuk;
            });

            return result;
        } catch (error) {
            console.error("Service Error:", error);
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
            throw new Error("Failed to delete file from storage");
        }
    }

    static async deleteSuratmasuk(
        no_surat_masuk: string
    ): Promise<void> {
        const suratmasuk = await prismaClient.suratMasuk.findUnique({
            where: { no_surat_masuk: no_surat_masuk },
        });

        if (!suratmasuk) {
            throw new Error(`Surat masuk with ID ${no_surat_masuk} not found`);
        }

        try {
            await prismaClient.$transaction(async (tx) => {
                // Delete the database record first
                await tx.suratMasuk.delete({
                    where: { no_surat_masuk: no_surat_masuk },
                });

                // If database deletion is successful, delete the file from MinIO
                if (suratmasuk.scan_surat) {
                    await this.deleteFileFromMinio(suratmasuk.scan_surat);
                }
            });
        } catch (error) {
            console.error("Error deleting surat masuk:", error);
            throw new Error("Failed to delete surat masuk");
        }
    }
}

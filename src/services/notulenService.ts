import { PrismaClient } from '@prisma/client';
import { CreateNotulenRequest, UpdateNotulenRequest, NotulenResponse, toNotulenResponse } from '../model/notulenModel';
import { v4 as uuidv4 } from 'uuid';
import { Validation } from '../validation/validation';
import { notulenValidation } from '../validation/notulenValidation';
import { PaginatedResponse } from '../model/suratmasukModel';
import { responseError } from '../error/responseError';
import { MINIO_ENDPOINT, MINIO_PORT, minioClient } from '../helper/minioClient';
import { ZodError } from 'zod';

const prisma = new PrismaClient();
const BUCKET_NAME = "notulen";

export class NotulenService {
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
    static async getAllNotulen(
        page: number = 1,
        totalData: number = 10,
        status?: string,
        judul?: string,

    ): Promise<PaginatedResponse<NotulenResponse>> {
        const skip = (page - 1) * totalData;
        const take = totalData;
        const where: any = {};

        if (status) {
            where.status = {
                contains: status,
            };
        }
        if (judul) {
            where.judul = {
                contains: judul,
            };
        }

        const [notulen, totalItems] = await Promise.all([
            prisma.notulen.findMany({
                skip,
                take,
                where,
                orderBy: {
                    tanggal: 'desc',
                }
            }),
            prisma.notulen.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / totalData);

        return {
            data: notulen.map(sm => toNotulenResponse(sm)),
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

    static async createNotulen(
        request: CreateNotulenRequest,
        userId: string,
        file: Express.Multer.File,
    ): Promise<NotulenResponse> {
        try {
            const findNameUser = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!file) {
                throw new responseError(400, 'File is required');
            }

            const filename = `${Date.now()}-${file.originalname}`;
            let fileUrl = '';

            try {
                // Ensure MinIO bucket exists
                const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
                if (!bucketExists) {
                    await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
                }

                // Upload file to MinIO
                await minioClient.putObject(BUCKET_NAME, filename, file.buffer);
                fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${filename}`;

                const validateRequest = {
                    ...request,
                    dokumen_lampiran: fileUrl,
                };

                // Validate request
                const validated = Validation.validate(
                    notulenValidation.NotulenValidation,
                    validateRequest
                );

                const tanggal = new Date(validated.tanggal);
                if (isNaN(tanggal.getTime())) {
                    throw new responseError(400, 'Invalid date format');
                }

                // Use transaction to ensure database and file operations are atomic
                const notulen = await prisma.$transaction(async (tx) => {
                    const result = await tx.notulen.create({
                        data: {
                            id: uuidv4(),
                            judul: validated.judul,
                            tanggal: tanggal,
                            lokasi: validated.lokasi,
                            pemimpin_rapat: validated.pemimpin_rapat,
                            peserta: validated.peserta,
                            agenda: validated.agenda,
                            dokumen_lampiran: fileUrl,
                            status: validated.status,
                            updated_by: findNameUser?.nama || "",
                            created_by: findNameUser?.nama || "",
                            user_id: userId,
                        }
                    });
                    return result;
                });

                return toNotulenResponse(notulen);
            } catch (error) {
                if (fileUrl) {
                    await this.deleteFileFromMinio(fileUrl);
                }
                throw error;
            }
        } catch (error) {
            console.error('Error creating notulen:', error);
            if (error instanceof responseError) {
                throw error;
            }
            throw new responseError(500, 'Internal server error');
        }
    }

    static async updateNotulen(
        userId: string,
        id: string,
        request: UpdateNotulenRequest,
        file?: Express.Multer.File,
    ): Promise<NotulenResponse> {
        try {
            const findNotulen = await prisma.notulen.findUnique({ where: { id } });
            if (!findNotulen) {
                throw new responseError(404, `Notulen with ID ${id} not found`);
            }

            const validateRequest = Validation.validate(notulenValidation.UpdateNotulenValidation, request);

            const rawTanggal = validateRequest.tanggal;
            const timestamp = Date.parse(rawTanggal);
            if (isNaN(timestamp)) {
                throw new responseError(400, 'Kesalahan format input data tanggal, format yang benar YY-MM-DD');
            }

            const tanggal = new Date(timestamp);
            let fileUrl = findNotulen.dokumen_lampiran;

            if (file) {
                try {
                    // Delete existing file if it exists
                    if (findNotulen.dokumen_lampiran) {
                        await this.deleteFileFromMinio(findNotulen.dokumen_lampiran);
                    }

                    const filename = `${Date.now()}-${file.originalname}`;
                    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
                    if (!bucketExists) {
                        await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
                    }

                    await minioClient.putObject(BUCKET_NAME, filename, file.buffer);
                    fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${filename}`;
                } catch (error) {
                    console.error('Error updating file in MinIO:', error);
                    throw new responseError(500, 'Failed to update file in storage');
                }
            }

            // Use transaction to ensure database and file operations are atomic
            const updatedNotulen = await prisma.$transaction(async (tx) => {
                const result = await tx.notulen.update({
                    where: { id },
                    data: {
                        judul: validateRequest.judul,
                        tanggal: tanggal,
                        lokasi: validateRequest.lokasi,
                        pemimpin_rapat: validateRequest.pemimpin_rapat,
                        peserta: validateRequest.peserta,
                        agenda: validateRequest.agenda,
                        dokumen_lampiran: fileUrl,
                        status: validateRequest.status,
                        updated_by: validateRequest.updated_by,
                        created_by: validateRequest.created_by,
                        user_id: validateRequest.user_id,
                    }
                });
                return result;
            });

            return toNotulenResponse(updatedNotulen);
        } catch (error) {
            if (error instanceof responseError) {
                throw error;
            }
            console.error('Error updating notulen:', error);
            throw new responseError(500, 'Internal server error');
        }
    }

    static async deleteNotulen(id: string): Promise<void> {
        try {
            const findNotulen = await prisma.notulen.findUnique({ where: { id } });
            if (!findNotulen) {
                throw new responseError(404, `Notulen with ID ${id} not found`);
            }

            // Use transaction to ensure both database and file deletion are atomic
            await prisma.$transaction(async (tx) => {
                // Delete database record first
                await tx.notulen.delete({ where: { id } });

                // If database deletion successful, delete file from MinIO
                if (findNotulen.dokumen_lampiran) {
                    await this.deleteFileFromMinio(findNotulen.dokumen_lampiran);
                }
            });
        } catch (error) {
            console.error('Error deleting notulen:', error);
            throw new responseError(500, 'Internal server error');
        }
    }

    static async getNotulenById(id: string): Promise<NotulenResponse> {
        try {
            const notulen = await prisma.notulen.findUnique({
                where: { id }
            });

            if (!notulen) {
                throw new responseError(404, `Notulen with ID ${id} not found`);
            }

            return toNotulenResponse(notulen);
        } catch (error) {
            console.log('Error deleting notulen ', error);
            if (error instanceof ZodError) {
                throw new responseError(400, 'Validation Error: ' + error.errors.map(e => e.message).join(', '));
            } else if (error instanceof responseError) {
                throw error;
            }
            console.error('Error updating faktur:', error);
            throw new responseError(500, 'Internal server error');
        }
    }

}

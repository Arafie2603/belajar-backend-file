import { PrismaClient } from '@prisma/client';
import { CreateFakturRequest, UpdateNomorSuraRequest, FakturResponse, toFakturResponse, PaginatedResponse } from '../model/fakturModel';
import { responseError } from '../error/responseError';
import { fakturValidation } from '../validation/fakturValidation';
import { ZodError } from 'zod';
import { MINIO_ENDPOINT, MINIO_PORT, minioClient } from '../helper/minioClient';
import { error } from 'console';

const prismaClient = new PrismaClient();
const BUCKET_NAME = "faktur";

export class FakturService {
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
    static async createFaktur(
        request: CreateFakturRequest,
        userId: string,
        file: Express.Multer.File,
    ): Promise<FakturResponse> {
        try {
            const filename = `${Date.now()}-${file.originalname}`;

            const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
            if (!bucketExists) {
                await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
            }

            await minioClient.putObject(BUCKET_NAME, filename, file.buffer);
            const fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${filename}`;

            const validateRequest = {
                ...request,
                bukti_pembayaran: fileUrl,
            };

            const faktur = await prismaClient.faktur.create({
                data: validateRequest
            });

            return toFakturResponse(faktur);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new responseError(400, 'Validation Error: ' + error.errors.map(e => e.message).join(', '));
            }
            console.error('Error creating faktur:', error);
            throw new responseError(500, 'Internal server error');
        }
    }

    static async getFakturById(id: string): Promise<FakturResponse> {
        try {
            const faktur = await prismaClient.faktur.findUnique({ where: { id } });
            if (!faktur) {
                throw new responseError(404, `Faktur with ID ${id} not found`);
            }
            return toFakturResponse(faktur);
        } catch (error) {
            console.error('Error retrieving faktur:', error);
            if (error instanceof ZodError) {
                throw new responseError(400, 'Validation Error: ' + error.errors.map(e => e.message).join(', '));
            } else if (error instanceof responseError) {
                throw error;
            }
            throw new responseError(500, 'Internal server error');
        }
    }

    static async updateFaktur(
        id: string,
        request: UpdateNomorSuraRequest,
        file?: Express.Multer.File,
    ): Promise<FakturResponse> {
        try {
            const findFaktur = await prismaClient.faktur.findUnique({ where: { id } });

            if (!findFaktur) {
                throw new responseError(404, `Faktur with ID ${id} not found`);
            }

            let fileUrl = findFaktur.bukti_pembayaran;

            if (file) {
                // Delete old file first
                if (findFaktur.bukti_pembayaran) {
                    await this.deleteFileFromMinio(findFaktur.bukti_pembayaran);
                }

                // Upload new file
                const filename = `${Date.now()}-${file.originalname}`;
                const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
                if (!bucketExists) {
                    await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
                }

                await minioClient.putObject(BUCKET_NAME, filename, file.buffer);
                fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${filename}`;
            }

            const validateRequest = {
                ...request,
                bukti_pembayaran: fileUrl,
            };

            const faktur = await prismaClient.faktur.update({
                where: { id },
                data: validateRequest
            });
            return toFakturResponse(faktur);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new responseError(400, 'Validation Error: ' + error.errors.map(e => e.message).join(', '));
            } else if (error instanceof responseError) {
                throw error;
            }
            console.error('Error updating faktur:', error);
            throw new responseError(500, 'Internal server error');
        }
    }

    static async deleteFaktur(id: string): Promise<void> {
        try {
            const faktur = await prismaClient.faktur.findUnique({ where: { id } });
            if (!faktur) {
                throw new responseError(404, `Faktur with ID ${id} not found`);
            }

            // Delete file from MinIO first
            if (faktur.bukti_pembayaran) {
                await this.deleteFileFromMinio(faktur.bukti_pembayaran);
            }

            // Then delete the record from database
            await prismaClient.faktur.delete({ where: { id } });
        } catch (error) {
            if (error instanceof ZodError) {
                throw new responseError(400, 'Validation Error: ' + error.errors.map(e => e.message).join(', '));
            } else if (error instanceof responseError) {
                throw error;
            }
            console.error('Error deleting faktur:', error);
            throw new responseError(500, 'Internal server error');
        }
    }

    static async getAllFaktur(
        page: number = 1,
        totalData: number = 10,
        deskripsi?: string,
    ): Promise<PaginatedResponse<FakturResponse>> {
        const skip = (page - 1) * totalData;
        const take = totalData;
        const where: any = {};

        if (deskripsi) {
            where.deskripsi = {
                contains: deskripsi,
            };
        }

        const [faktur, totalItems] = await Promise.all([
            prismaClient.faktur.findMany({
                skip,
                take,
                where,
                orderBy: {
                    createdAt: 'desc',
                }
            }),
            prismaClient.faktur.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / totalData);

        return {
            data: faktur.map(sm => toFakturResponse(sm)),
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
}

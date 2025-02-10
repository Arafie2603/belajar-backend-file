import { PrismaClient } from '@prisma/client';
import { CreateFakturRequest, UpdateNomorSuraRequest, FakturResponse, toFakturResponse, PaginatedResponse } from '../model/fakturModel';
import { responseError } from '../error/responseError';
import { fakturValidation } from '../validation/fakturValidation';
import { ZodError } from 'zod';
import { MINIO_ENDPOINT, MINIO_PORT, minioClient } from '../helper/minioClient';
import { error } from 'console';

const prismaClient = new PrismaClient();

export class FakturService {
    static async createFaktur(
        request: CreateFakturRequest,
        userId: string,
        file: Express.Multer.File,

    ): Promise<FakturResponse> {
        try {
            const filename = `${Date.now()}-${file.originalname}`;
            const bucketName = "faktur";

            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, "us-east-1");
            }

            await minioClient.putObject(bucketName, filename, file.buffer);
            const fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucketName}/${filename}`;

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

            const filename = `${Date.now()}-${file?.originalname}`;
            const bucketName = "faktur";

            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, "us-east-1");
            }

            if (file) {
                await minioClient.putObject(bucketName, filename, file.buffer);
            }

            const fileUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${filename}`;

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
            await prismaClient.faktur.delete({ where: { id } });
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

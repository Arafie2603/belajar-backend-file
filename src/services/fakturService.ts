import { PrismaClient } from '@prisma/client';
import { CreateFakturRequest, FakturResponse, toFakturResponse, PaginatedResponse, UpdateFakturRequest } from '../model/fakturModel';
import { responseError } from '../error/responseError';
import { fakturValidation } from '../validation/fakturValidation';
import { z, ZodError } from 'zod';
import { MINIO_ENDPOINT, MINIO_PORT, minioClient } from '../helper/minioClient';
import { error } from 'console';
import moment from 'moment';
import { normalizeDate } from '../helper/normalizeDate';
import { Validation } from '../validation/validation';
import Decimal from "decimal.js";

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
        file?: Express.Multer.File,
    ): Promise<FakturResponse> {
        try {
            const findUser = await prismaClient.user.findFirst({ where: { id: userId } });

            let fileUrl = "";
            const validatedRequest = Validation.validate(fakturValidation.CreateFakturValidation, {
                ...request,
                jumlah_pengeluaran: request.jumlah_pengeluaran ? new Decimal(request.jumlah_pengeluaran) : undefined
            });

            if (file) {
                const filename = `${Date.now()}-${file.originalname}`;

                const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
                if (!bucketExists) {
                    await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
                }

                await minioClient.putObject(BUCKET_NAME, filename, file.buffer);
                fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${filename}`;
            }


            console.log("Request body in controller:", validatedRequest.tanggal);

            const parsedTanggal = moment(validatedRequest.tanggal, ["DD/MM/YYYY", "D/M/YYYY"], true);

            if (!parsedTanggal.isValid()) {
                throw new Error("Invalid date format. Please use DD/MM/YYYY.");
            }

            const finalTanggal = moment.utc(parsedTanggal).toDate();



            console.log('Input date:', validatedRequest.tanggal);
            console.log('Parsed date:', parsedTanggal);

            const faktur = await prismaClient.faktur.create({
                data: {
                    ...validatedRequest,
                    bukti_pembayaran: fileUrl || "",
                    created_by: findUser?.nama || "",
                    tanggal: parsedTanggal,
                    user: {
                        connect: { id: userId }
                    }
                },
                include: { user: true }
            });

            return toFakturResponse(faktur);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation Error:", error.errors);

                const errorDetails = error.errors.map(e => ({
                    path: e.path.join("."),
                    message: e.message
                }));

                throw new responseError(400, "Invalid request");
            }

            console.error("Error creating faktur:", error);
            throw new responseError(500, "Internal server error");
        }
    }


    static async updateFaktur(
        id: string,
        userId: string,
        request: UpdateFakturRequest,
        file?: Express.Multer.File,
    ): Promise<FakturResponse> {
        try {
            const findFaktur = await prismaClient.faktur.findUnique({ where: { id } });

            if (!findFaktur) {
                throw new responseError(404, `Faktur with ID ${id} not found`);
            }

            let fileUrl = findFaktur.bukti_pembayaran;

            if (file) {
                if (findFaktur.bukti_pembayaran && findFaktur.bukti_pembayaran != "") {
                    await this.deleteFileFromMinio(findFaktur.bukti_pembayaran);
                }

                const filename = `${file.originalname}`;
                const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
                if (!bucketExists) {
                    await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
                }

                await minioClient.putObject(BUCKET_NAME, filename, file.buffer);
                fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${BUCKET_NAME}/${filename}`;
            }

            const validatedRequest = Validation.validate(fakturValidation.UpdateFakturValidation, {
                ...request,
                bukti_pembayaran: fileUrl,
            });

            const findUser = await prismaClient.user.findFirst({ where: { id: userId } });

            // Parse tanggal to handle various date formats
            const parsedTanggal = validatedRequest.tanggal
                ? moment(validatedRequest.tanggal, ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY", "YYYY/MM/DD"]).toDate()
                : new Date();

            const faktur = await prismaClient.faktur.update({
                where: { id },
                data: {
                    ...validatedRequest,
                    jumlah_pengeluaran: validatedRequest.jumlah_pengeluaran,
                    metode_pembayaran: validatedRequest.metode_pembayaran,
                    status_pembayaran: validatedRequest.status_pembayaran,
                    updated_by: findUser?.nama || "",
                    tanggal: parsedTanggal,
                    user: {
                        connect: { id: userId }
                    }
                },
                include: { user: true }
            });
            return toFakturResponse(faktur);
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new responseError(400, 'Validation Error: ' + error.errors.map(e => e.message).join(', '));
            } else if (error instanceof responseError) {
                throw error;
            }
            console.error('Error updating faktur:', error);
            throw new responseError(500, 'Internal server error');
        }
    }


    static async getFakturById(id: string): Promise<FakturResponse> {
        try {
            const faktur = await prismaClient.faktur.findUnique({
                where: { id },
                include: { user: true },
            });
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
                    tanggal: 'desc',
                },
                include: { user: true }
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

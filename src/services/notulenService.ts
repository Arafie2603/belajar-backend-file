import { PrismaClient } from '@prisma/client';
import { CreateNotulenRequest, UpdateNotulenRequest, NotulenResponse, toNotulenResponse } from '../model/notulenModel';
import { v4 as uuidv4 } from 'uuid';
import { Validation } from '../validation/validation';
import { notulenValidation } from '../validation/notulenValidation';
import { PaginatedResponse } from '../model/suratmasukModel';
import { responseError } from '../error/responseError';
import { MINIO_ENDPOINT, MINIO_PORT, minioClient } from '../helper/minioClient';

const prisma = new PrismaClient();

export class NotulenService {
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
                    tanggal_rapat: 'desc',
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
                where: {
                    id: userId,
                }
            });

            if (!file) {
                throw new responseError(400, 'File is required');
            }

            const filename = `${Date.now()}-${file.originalname}`; // Tambahkan timestamp untuk menghindari nama file duplikat
            const bucketName = "notulen";

            try {
                // Pastikan bucket MinIO ada sebelum menyimpan file
                const bucketExists = await minioClient.bucketExists(bucketName);
                if (!bucketExists) {
                    await minioClient.makeBucket(bucketName, "us-east-1");
                }

                await minioClient.putObject(bucketName, filename, file.buffer);
                const fileUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucketName}/${filename}`;

                const validateRequest = {
                    ...request,
                    dokumen_lampiran: fileUrl,
                };

                // Validasi request
                const validated = Validation.validate(
                    notulenValidation.NotulenValidation,
                    validateRequest
                );

                // Konversi tanggal_rapat
                const tanggal_rapat = new Date(validated.tanggal_rapat);
                if (isNaN(tanggal_rapat.getTime())) {
                    throw new responseError(400, 'Invalid date format');
                }

                const notulen = await prisma.notulen.create({
                    data: {
                        id: uuidv4(),
                        judul: validated.judul,
                        tanggal_rapat: tanggal_rapat,
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

                return toNotulenResponse(notulen);
            } catch (minioError) {
                console.error('MinIO error:', minioError);
                throw new responseError(500, 'Failed to upload file');
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

            // Konversi tanggal_rapat menjadi format Date
            const rawTanggal = validateRequest.tanggal_rapat;
            const timestamp = Date.parse(rawTanggal);
            if (isNaN(timestamp)) {
                throw new responseError(400, 'Kesalahan format input data tanggal, format yang benar YY-MM-DD');
            }

            const tanggal_rapat = new Date(timestamp);

            let fileUrl = findNotulen.dokumen_lampiran;
            if (file) {
                const filename = `${file.originalname}`;
                const bucketName = "notulen";
                fileUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${filename}`;
                const bucketExists = await minioClient.bucketExists(bucketName);
                if (!bucketExists) {
                    await minioClient.makeBucket(bucketName, "us-east-1");
                }
                await minioClient.putObject(bucketName, filename, file.buffer);
            }

            const updatedNotulen = await prisma.notulen.update({
                where: { id },
                data: {
                    judul: validateRequest.judul,
                    tanggal_rapat: tanggal_rapat,
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
            const findNtoulen = await prisma.notulen.findUnique({ where: { id } });
            if (!findNtoulen) {
                throw new responseError(404, `Notulen with ID ${id} not found`);
            }
            await prisma.notulen.delete({
                where: { id }
            });
        } catch (error) {
            console.log('Error deleting notulen ', error);
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
            throw new responseError(500, 'Internal server error');
        }
    }

}

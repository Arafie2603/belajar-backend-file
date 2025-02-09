import { PrismaClient } from '@prisma/client';
import { CreateNotulenRequest, UpdateNotulenRequest, NotulenResponse, toNotulenResponse } from '../model/notulenModel';
import { v4 as uuidv4 } from 'uuid';
import { Validation } from '../validation/validation';
import { notulenValidation } from '../validation/notulenValidation';
import { PaginatedResponse } from '../model/suratmasukModel';

const prisma = new PrismaClient();

export class NotulenService {
    static async createNotulen(request: CreateNotulenRequest, userId: string): Promise<NotulenResponse> {
        const validateRequest = Validation.validate(notulenValidation.NotulenValidation, request);
        const findNameUser = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        // Konversi tanggal_rapat menjadi format Date
        const rawTanggal = validateRequest.tanggal_rapat;
        const timestamp = Date.parse(rawTanggal);

        if (isNaN(timestamp)) {
            throw new Error(`Format tanggal tidak valid: ${rawTanggal}`);
        }

        const tanggal_rapat = new Date(timestamp);
        const notulen = await prisma.notulen.create({
            data: {
                id: uuidv4(),
                judul: validateRequest.judul,
                tanggal_rapat: tanggal_rapat,
                lokasi: validateRequest.lokasi,
                pemimpin_rapat: validateRequest.pemimpin_rapat,
                peserta: validateRequest.peserta,
                agenda: validateRequest.agenda,
                dokumen_lampiran: validateRequest.dokumen_lampiran,
                status: validateRequest.status,
                updated_by: findNameUser?.nama || "",
                created_by: findNameUser?.nama || "",
                user_id: userId,
            }
        });
        return toNotulenResponse(notulen);
    }

    static async updateNotulen(id: string, request: UpdateNotulenRequest): Promise<NotulenResponse> {
        const validateRequest = Validation.validate(notulenValidation.UpdateNotulenValidation, request);
        const notulen = await prisma.notulen.update({
            where: { id },
            data: {
                judul: validateRequest.judul,
                tanggal_rapat: validateRequest.tanggal,
                lokasi: validateRequest.lokasi,
                pemimpin_rapat: validateRequest.pemimpin_rapat,
                peserta: validateRequest.peserta,
                agenda: validateRequest.agenda,
                dokumen_lampiran: validateRequest.dokumen_lampiran,
                status: validateRequest.status,
                updated_by: validateRequest.updated_by,
                created_by: validateRequest.created_by,
                user_id: validateRequest.user_id,
            }
        });
        return toNotulenResponse(notulen);
    }

    static async deleteNotulen(id: string): Promise<void> {
        await prisma.notulen.delete({
            where: { id }
        });
    }

    static async getNotulenById(id: string): Promise<NotulenResponse> {
        const notulen = await prisma.notulen.findUnique({
            where: { id }
        });

        if (!notulen) {
            throw new Error(`Notulen with ID ${id} not found`);
        }

        return toNotulenResponse(notulen);
    }

    static async getAllNotulen(): Promise<PaginatedResponse<NotulenResponse>> {
        const notulenList = await prisma.notulen.findMany();

        const data = notulenList.map((notulen) => toNotulenResponse(notulen));
        return {
            data,
            meta: {
                currentPage: 1,
                offset: 0,
                itemsPerPage: data.length,
                unpaged: false,
                totalPages: 1,
                totalItems: data.length,
                sortBy: [],
                filter: {}
            }
        };
    }
}

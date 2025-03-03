import moment from "moment";
import { prismaClient } from "../application/database";
import { responseError } from "../error/responseError";
import { CreateNomorSurat, NomorSuratResponse, PaginatedResponse, toNomorSuratResponse, UpdateNomorSuraRequest } from "../model/nomorsuratModel";
import { nomorValidation } from "../validation/nomorValidation";
import { Validation } from "../validation/validation";
import { normalizeDate } from "../helper/normalizeDate";

export class nomorService {
    static async getAllnomorSurat(
        page: number = 1,
        totalData: number = 10,
        kategori?: string,
    ): Promise<PaginatedResponse<NomorSuratResponse>> {
        const skip = (page - 1) * totalData;
        const take = totalData;
        const where: any = {};

        if (kategori) {
            where.kategori = {
                contains: kategori,
            };
        }

        const [nomorSurat, totalItems] = await Promise.all([
            prismaClient.nomorSurat.findMany({
                skip,
                take,
                where,
                orderBy: {
                    nomor_surat: 'desc',
                }
            }),
            prismaClient.nomorSurat.count({ where }),
        ]);

        const totalPages = Math.ceil(totalItems / totalData);

        return {
            data: nomorSurat.map(sm => toNomorSuratResponse(sm)),
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
    static async getNomorSuratById(id: string): Promise<NomorSuratResponse> {
        const existingNomorSurat = await prismaClient.nomorSurat.findUnique({
            where: { nomor_surat: id }
        });

        if (!existingNomorSurat) {
            throw new responseError(404, `NomorSurat with ID ${id} not found`);
        }

        return toNomorSuratResponse(existingNomorSurat);
    }

    static async createNomorSurat(request: CreateNomorSurat, userId: string): Promise<NomorSuratResponse> {
        const validatedRequest = Validation.validate(nomorValidation.NomorValidation, request);

        const kategoriMap: { [key: string]: string } = {
            H: "Perbaikan",
            SA: "Sertifikat Asisten",
            SS: "Sertifikat Webinar",
            P: "Formulir pendaftaran calas",
            S: "SK Asisten",
        };

        const kategori = kategoriMap[validatedRequest.keterangan] || "Lainnya";

        const countNomorSurat = await prismaClient.nomorSurat.count();
        const newNomorSuratNumber = (countNomorSurat + 1).toString().padStart(2, '0');
        const now = new Date();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const year = now.getFullYear().toString().slice(-2);
        const findUser = await prismaClient.user.findFirst({ where: { id: userId } });

        const prefixMap: { [key: string]: string } = {
            H: "H",
            SA: "SA",
            SS: "SS",
            P: "P",
            S: "S",
        };
        const parsedCreatedAt = validatedRequest.createdAt
            ? moment(validatedRequest.createdAt, ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"]).toDate()
            : new Date();

        const prefix = prefixMap[validatedRequest.keterangan] || "XX";

        const nomorSuratFormat = `${prefix}/UBL/LAB/${newNomorSuratNumber}/${month}/${year}`;

        const existingNomorSurat = await prismaClient.nomorSurat.findUnique({
            where: { nomor_surat: nomorSuratFormat }
        });

        if (existingNomorSurat) {
            throw new responseError(400, `NomorSurat with format ${nomorSuratFormat} already exists`);
        }

        const nomorSurat = await prismaClient.nomorSurat.create({
            data: {
                nomor_surat: nomorSuratFormat,
                keterangan: validatedRequest.keterangan,
                deskripsi: validatedRequest.deskripsi,
                kategori: kategori,
                created_by: findUser?.nama || "",
                createdAt: parsedCreatedAt,
            }
        });
        return toNomorSuratResponse(nomorSurat);
    }



    static async updateNomorSurat(
        id: string,
        request: UpdateNomorSuraRequest,
        userId: string,
    ): Promise<NomorSuratResponse> {
        const existingNomorSurat = await prismaClient.nomorSurat.findUnique({
            where: { nomor_surat: id }
        });
    
        if (!existingNomorSurat) {
            throw new responseError(404, `NomorSurat with ID ${id} not found`);
        }
    
        const validatedRequest = Validation.validate(nomorValidation.UpdateNomorValidation, request);
        const findUser = await prismaClient.user.findFirst({ where: { id: userId } });
    
        const kategoriMap: { [key: string]: string } = {
            H: "Perbaikan",
            SA: "Sertifikat Asisten",
            SS: "Sertifikat Webinar",
            P: "Formulir pendaftaran calas",
            S: "SK Asisten",
        };
    
        const prefixMap: { [key: string]: string } = {
            H: "H",
            SA: "SA",
            SS: "SS",
            P: "P",
            S: "S",
        };
    
        if (validatedRequest.keterangan) {
            validatedRequest.kategori = kategoriMap[validatedRequest.keterangan] || "Lainnya";
            const newPrefix = prefixMap[validatedRequest.keterangan] || "XX";
    
            const nomorSuratParts = existingNomorSurat.nomor_surat.split('/');
            nomorSuratParts[0] = newPrefix;
            validatedRequest.nomor_surat = nomorSuratParts.join('/');
        }
    
        if (!validatedRequest.tanggal) {
            validatedRequest.tanggal = new Date().toISOString();
        } else {
            const normalizedDate = normalizeDate(validatedRequest.tanggal);
            validatedRequest.tanggal = normalizedDate || new Date().toISOString();
        }
        
        const parsedCreatedAt = validatedRequest.createdAt
            ? moment(validatedRequest.createdAt, ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"]).toDate()
            : new Date();
    
        const updatedNomorSurat = await prismaClient.nomorSurat.update({
            where: { nomor_surat: id },
            data: {
                ...validatedRequest,
                createdAt: parsedCreatedAt,
                updated_by: findUser?.nama,
            },
        });
    
        return toNomorSuratResponse(updatedNomorSurat);
    }

    static async deleteNomorSurat(id: string): Promise<void> {
        const existingNomorSurat = await prismaClient.nomorSurat.findUnique({
            where: { nomor_surat: id }
        });

        if (!existingNomorSurat) {
            throw new responseError(404, `NomorSurat with ID ${id} not found`);
        }

        await prismaClient.nomorSurat.delete({
            where: { nomor_surat: id }
        });
    }


}
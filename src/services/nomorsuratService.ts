import { prismaClient } from "../application/database";
import { responseError } from "../error/responseError";
import { CreateNomorSurat, NomorSuratResponse, PaginatedResponse, toNomorSuratResponse, UpdateNomorSuraRequest } from "../model/nomorsuratModel";
import { nomorValidation } from "../validation/nomorValidation";
import { Validation } from "../validation/validation";

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
    
    static async createNomorSurat(request: CreateNomorSurat): Promise<NomorSuratResponse> {
        const validateRequest = Validation.validate(nomorValidation.NomorValidation, request);
        
        // Definisikan mapping keterangan ke kategori
        const kategoriMap: { [key: string]: string } = {
            H: "Perbaikan",
            SA: "Sertifikat Asisten",
            SS: "Sertifikat Webinar",
            P: "Formulir pendaftaran calas",
            S: "SK Asisten",
        };
    
        // Isi kategori berdasarkan keterangan
        const kategori = kategoriMap[validateRequest.keterangan] || "Lainnya";
    
        // Mendapatkan jumlah data saat ini dari NomorSurat
        const countNomorSurat = await prismaClient.nomorSurat.count();
        const newNomorSuratNumber = (countNomorSurat + 1).toString().padStart(2, '0'); // Tambahkan 0 di depan jika satu digit
    
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
    
        const prefix = prefixMap[validateRequest.keterangan] || "XX";
    
        // Format nomor surat sesuai aturan
        const nomorSuratFormat = `${prefix}/UBL/LAB/${newNomorSuratNumber}/${month}/${year}`;
    
        // Periksa apakah nomor surat sudah ada
        const existingNomorSurat = await prismaClient.nomorSurat.findUnique({
            where: { nomor_surat: nomorSuratFormat }
        });
    
        if (existingNomorSurat) {
            throw new responseError(400, `NomorSurat with format ${nomorSuratFormat} already exists`);
        }
    
        // Membuat nomor surat baru
        const nomorSurat = await prismaClient.nomorSurat.create({
            data: {
                nomor_surat: nomorSuratFormat, // Gunakan format nomor surat yang sesuai aturan
                keterangan: validateRequest.keterangan,
                deskripsi: validateRequest.deskripsi,
                kategori: kategori, // Gunakan kategori yang otomatis diisi
            }
        });
        return toNomorSuratResponse(nomorSurat);
    }
    


    static async updateNomorSurat(
        id: string,
        request: UpdateNomorSuraRequest
    ): Promise<NomorSuratResponse> {
        const existingNomorSurat = await prismaClient.nomorSurat.findUnique({
            where: { nomor_surat: id }
        });
    
        if (!existingNomorSurat) {
            throw new responseError(404, `NomorSurat with ID ${id} not found`);
        }
    
        const validateRequest = Validation.validate(nomorValidation.UpdateNomorValidation, request);
    
        // Definisikan mapping keterangan ke kategori dan prefix
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
    
        if (validateRequest.keterangan) {
            validateRequest.kategori = kategoriMap[validateRequest.keterangan] || "Lainnya";
            const newPrefix = prefixMap[validateRequest.keterangan] || "XX";
            
            const nomorSuratParts = existingNomorSurat.nomor_surat.split('/');
            nomorSuratParts[0] = newPrefix;
            validateRequest.nomor_surat = nomorSuratParts.join('/');
        }
    
        const updatedNomorSurat = await prismaClient.nomorSurat.update({
            where: { nomor_surat: id },
            data: validateRequest,
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
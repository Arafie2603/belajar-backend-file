import { prismaClient } from "../application/database";
import { createNomorSurat, NomorSuratResponse, toNomorSuratResponse } from "../model/nomorsuratModel";
import { nomorValidation } from "../validation/nomorValidation";
import { Validation } from "../validation/validation";

export class nomorService {
    static async createNomorSurat(request: createNomorSurat): Promise<NomorSuratResponse> {
        const validateRequest = Validation.validate(nomorValidation.NomorValidation, request);
        const nomorSurat = await prismaClient.nomorSurat.create({
            data: {
                nomor_surat: validateRequest.nomor_surat,
                keterangan: validateRequest.keterangan,
                deskripsi: validateRequest.deskripsi,
            }
        });
        return toNomorSuratResponse(nomorSurat);
    }
    
    
}
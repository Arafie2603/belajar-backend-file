import { z, ZodType } from "zod";



export class nomorValidation {
    static readonly NomorValidation: ZodType = z.object({
        nomor_surat: z.string().min(3).max(20),
        keterangan: z.string().min(3).max(100),
        deskripsi: z.string().min(3).max(100),
    });
}
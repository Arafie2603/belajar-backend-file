import { z, ZodType } from "zod";



export class nomorValidation {
    static readonly NomorValidation: ZodType = z.object({
        keterangan: z.string().max(100),
        deskripsi: z.string().min(3).max(100),
    });

    static readonly UpdateNomorValidation: ZodType = z.object({
        keterangan: z.string().max(100, "keterangan tidak boleh lebih dari 100"),
        deskripsi: z.string().min(3, "Deskripsi minimal 3 huruf").max(100, "Deskripsi tidak boleh lebih dari 100"),
    });
}
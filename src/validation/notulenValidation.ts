import { z, ZodType } from "zod";

export class notulenValidation {
    static readonly NotulenValidation: ZodType = z.object({
        judul: z.string().min(3).max(100),
        tanggal_rapat: z.string().transform((str) => new Date(str)),
        lokasi: z.string().min(3).max(100),
        pemimpin_rapat: z.string().min(3).max(100),
        peserta: z.string().min(3).max(100),
        agenda: z.string().min(3).max(100),
        dokumen_lampiran: z.string(),
        status: z.string().min(3).max(100),
    });

    static readonly UpdateNotulenValidation: ZodType = z.object({
        judul: z.string().min(3).max(100),
        tanggal_rapat: z.string().transform((str) => new Date(str)),
        lokasi: z.string().min(3).max(100),
        pemimpin_rapat: z.string().min(3).max(100),
        peserta: z.string().min(3).max(100),
        agenda: z.string().min(3).max(100),
        dokumen_lampiran: z.string(),
        status: z.string().min(3).max(100),
    });


}
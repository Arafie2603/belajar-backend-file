import { z, ZodType } from "zod";

export class notulenValidation {
    static readonly NotulenValidation: ZodType = z.object({
        judul: z.string().min(1, "Required"),
        tanggal: z.string().min(1, "Required"),
        lokasi: z.string().min(1, "Required"),
        pemimpin_rapat: z.string().min(1, "Required"),
        peserta: z.string().min(1, "Required"),
        agenda: z.string().min(1, "Required"),
        status: z.string().min(1, "Required"),
    });

    static readonly UpdateNotulenValidation: ZodType = z.object({
        judul: z.string().optional(),
        tanggal: z.string().optional(),
        lokasi: z.string().optional(),
        pemimpin_rapat: z.string().optional(),
        peserta: z.string().optional(),
        agenda: z.string().optional(),
        dokumen_lampiran: z.string().optional(),
        status: z.string().optional(),
        updated_by: z.string().optional(),
        created_by: z.string().optional(),
    });
}


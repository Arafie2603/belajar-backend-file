import { z, ZodType } from "zod";



export class fakturValidation {
    static readonly CreateFakturValidation: ZodType = z.object({
        bukti_pembayaran: z.string().url({ message: "Bukti pembayaran harus berupa URL valid" }),
        deskripsi: z.string().min(3, { message: "Deskripsi minimal 3 karakter" }).max(100, { message: "Deskripsi maksimal 100 karakter" }),
    });

    static readonly UpdateFakturValidation: ZodType = z.object({
        bukti_pembayaran: z.string().url().optional(),
        deskripsi: z.string().min(3).max(100).optional(),
    });
}
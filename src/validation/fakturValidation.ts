import { z, ZodType } from "zod";



export class fakturValidation {
    static readonly FakturValidation: ZodType = z.object({
        bukti_pembayaran: z.string(),
        deskripsi: z.string().min(3).max(100),
    });

    static readonly UpdateFakturValidation: ZodType = z.object({
        bukti_pembayaran: z.string(),
        deskripsi: z.string().min(3).max(100),
    });
}
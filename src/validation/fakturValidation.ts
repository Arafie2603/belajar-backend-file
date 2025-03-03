import moment from "moment";
import { z, ZodType } from "zod";

export class fakturValidation {
    static readonly CreateFakturValidation: ZodType = z.object({
        bukti_pembayaran: z.string().optional(),
        deskripsi: z.string().min(3, { message: "Deskripsi minimal 3 karakter" }).max(100, { message: "Deskripsi maksimal 100 karakter" }),
        jumlah_pengeluaran: z.preprocess((val) => Number(val), z.number().optional()), 
        metode_pembayaran: z.string(),
        status_pembayaran: z.string(),
        tanggal: z.string()
            .refine((val) => moment(val, ["DD/MM/YYYY", "D/M/YYYY"], true).isValid(), {
                message: "Invalid date format. Please use DD/MM/YYYY."
            }) 
    });


    static readonly UpdateFakturValidation: ZodType = z.object({
        bukti_pembayaran: z.string().url().optional(),
        deskripsi: z.string().min(3).max(100).optional(),
        jumlah_pengeluaran: z.preprocess((val) => Number(val), z.number().optional()), 
        metode_pembayaran: z.string().optional(),
        status_pembayaran: z.string().optional(),
        tanggal: z.string()
        .refine((val) => moment(val, ["DD/MM/YYYY", "D/M/YYYY"], true).isValid(), {
            message: "Invalid date format. Please use DD/MM/YYYY."
        }).optional(),
    });
}

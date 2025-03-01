import { z, ZodType } from 'zod';

export class suratmasukValidation {
    static readonly SuratmasukValidation: ZodType = z.object({
        tanggal: z.string()
            .refine((date) => !isNaN(Date.parse(date)), {
                message: "Invalid date format"
            }),
        alamat: z.string().max(100, "Alamat tidak boleh lebih dari 100 karakter"),
        perihal: z.string().max(100, "Perihal tidak boleh lebih dari 100 karakter"),
        tujuan: z.string().nonempty("Tujuan harus diisi"),
        organisasi: z.string().nonempty("Organisasi harus diisi"),
        pengirim: z.string().nonempty("Pengirim harus diisi"),
        penerima: z.string().nonempty("Penerima harus diisi"),
        sifat_surat: z.string().nonempty("Sifat surat harus diisi"),
        scan_surat: z.string().optional(),
        expired_data: z.string()
            .refine((date) => !isNaN(Date.parse(date)), {
                message: "Invalid date format"
            }),
    });
}
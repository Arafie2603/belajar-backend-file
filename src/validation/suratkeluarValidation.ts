import { z, ZodType } from 'zod';

export class suratkeluarValidation {
    static readonly SuratkeluarValidation: ZodType = z.object({
        tanggal: z.string()
            .refine((date) => !isNaN(Date.parse(date)), {
                message: "Invalid date format"
            }),
        tempat_surat: z.string().max(100, "Tempat surat tidak boleh lebih dari 100 karakter"),
        lampiran: z.string().max(100, "Lampiran tidak boleh lebih dari 100 karakter"),
        isi_surat: z.string().nonempty("Isi surat harus diisi"),
        penerima: z.string().nonempty("Penerima harus diisi"),
        pengirim: z.string().nonempty("Pengirim harus diisi"),
        jabatan_pengirim: z.string().nonempty("Jabatan pengirim harus diisi"),
        gambar: z.string(),
        keterangan_gambar: z.string().optional(),
        sifat_surat: z.string().min(3, "Sifat surat minimal harus 3 huruf").max(100, "Sifat surat tidak boleh lebih dari 100 karakter"),
        keterangan: z.string().min(1, "Keteraangan minimal harus 2 huruf").max(10),
    });

    static readonly UpdateSuratkeluarValidation: ZodType = z.object({
        tanggal: z.date().optional(),
        tempat_surat: z.string()
            .max(100, "Tempat surat tidak boleh lebih dari 100 karakter")
            .optional(),
        lampiran: z.string()
            .max(100, "Lampiran tidak boleh lebih dari 100 karakter")
            .optional(),
        isi_surat: z.string()
            .nonempty("Isi surat harus diisi")
            .optional(),
        penerima: z.string()
            .nonempty("Penerima harus diisi")
            .optional(),
        pengirim: z.string()
            .nonempty("Pengirim harus diisi")
            .optional(),
        jabatan_pengirim: z.string()
            .nonempty("Jabatan pengirim harus diisi")
            .optional(),
        gambar: z.string().optional(),
        keterangan_gambar: z.string().optional(),
        sifat_surat: z.string()
            .min(3, "Sifat surat minimal harus 3 huruf")
            .max(100, "Sifat surat tidak boleh lebih dari 100 karakter")
            .optional()
    }).partial();
}
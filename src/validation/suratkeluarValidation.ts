import { z, ZodType } from 'zod';

export class suratkeluarValidation {
    static readonly SuratkeluarValidation: ZodType = z.object({
        tanggal_surat: z.string()
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
        keterangan_gambar: z.string(),
        sifat_surat: z.string().min(3, "Sifat surat minimal harus 3 huruf").max(100, "Sifat surat tidak boleh lebih dari 100 karakter"),
        keterangan: z.string().min(2, "Keteraangan minimal harus 2 huruf").max(10),
        deskripsi: z.string().min(3, "deskripsi minimal harus 3 huruf").max(100, "deskripsi tidak boleh lebih dari 100 karakter"),
    });
}
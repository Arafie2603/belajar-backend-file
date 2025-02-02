"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suratmasukValidation = void 0;
const zod_1 = require("zod");
class suratmasukValidation {
}
exports.suratmasukValidation = suratmasukValidation;
suratmasukValidation.SuratmasukValidation = zod_1.z.object({
    no_surat_masuk: zod_1.z.string().nonempty("Nomor surat masuk harus diisi"),
    tanggal: zod_1.z.string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format"
    }),
    alamat: zod_1.z.string().max(100, "Alamat tidak boleh lebih dari 100 karakter"),
    perihal: zod_1.z.string().max(100, "Perihal tidak boleh lebih dari 100 karakter"),
    tujuan: zod_1.z.string().nonempty("Tujuan harus diisi"),
    organisasi: zod_1.z.string().nonempty("Organisasi harus diisi"),
    pengirim: zod_1.z.string().nonempty("Pengirim harus diisi"),
    penerima: zod_1.z.string().nonempty("Penerima harus diisi"),
    sifat_surat: zod_1.z.string().nonempty("Sifat surat harus diisi"),
    scan_surat: zod_1.z.string().nonempty("Scan surat harus diisi"),
    expired_data: zod_1.z.string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format"
    }),
});

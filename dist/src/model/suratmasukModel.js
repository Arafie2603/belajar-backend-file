"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSuratmasukResponseWithoutDisposisi = toSuratmasukResponseWithoutDisposisi;
function toSuratmasukResponseWithoutDisposisi(suratmasuk) {
    return {
        no_surat_masuk: suratmasuk.no_surat_masuk,
        tanggal: suratmasuk.tanggal,
        alamat: suratmasuk.alamat,
        perihal: suratmasuk.perihal,
        tujuan: suratmasuk.tujuan,
        organisasi: suratmasuk.organisasi,
        pengirim: suratmasuk.pengirim,
        penerima: suratmasuk.penerima,
        sifat_surat: suratmasuk.sifat_surat,
        scan_surat: suratmasuk.scan_surat,
        expired_data: suratmasuk.expired_data,
        user_id: suratmasuk.user_id,
        tanggal_penyelesaian: suratmasuk.tanggal_penyelesaian,
        isi_disposisi: suratmasuk.isi_disposisi,
    };
}

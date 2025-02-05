import { SuratKeluar } from "@prisma/client";


export type PaginatedResponse<T> = {
    data: T[];
    meta: {
        currentPage: number;
        offset: number;
        itemsPerPage: number;
        unpaged: boolean;
        totalPages: number;
        totalItems: number;
        sortBy: any[];
        filter: any;
    };
};

export type CreateSuratkeluarRequest = {
    no_surat_keluar: string;
    tanggal_surat: string;
    tempat_surat: string;
    lampiran: string;
    isi_surat: string;
    penerima: string;
    pengirim: string;
    jabatan_pengirim: string;
    gambar: string;
    keterangan_gambar: string;
    kategori: string;
    sifat_surat: string;
};

export type SuratkeluarResponse = {
    no_surat_keluar: string;
    tanggal_surat: Date;
    tempat_surat: string;
    lampiran: string;
    isi_surat: string;
    penerima: string;
    pengirim: string;
    jabatan_pengirim: string;
    gambar: string;
    keterangan_gambar: string;
    kategori: string;
    sifat_surat: string;
    user_id: string;
};

export function toSuratkeluarReponse(suratKeluar: SuratKeluar): SuratkeluarResponse {
    return {
        no_surat_keluar: suratKeluar.no_surat_keluar,
        tanggal_surat: suratKeluar.tanggal_surat,
        tempat_surat: suratKeluar.tempat_surat,
        lampiran: suratKeluar.lampiran,
        isi_surat: suratKeluar.isi_surat,
        penerima: suratKeluar.penerima,
        pengirim: suratKeluar.pengirim,
        jabatan_pengirim: suratKeluar.jabatan_pengirim,
        gambar: suratKeluar.gambar,
        keterangan_gambar: suratKeluar.keterangan_gambar,
        kategori: suratKeluar.kategori,
        sifat_surat: suratKeluar.sifat_surat,
        user_id: suratKeluar.user_id,
    }
}


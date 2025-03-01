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
    id: string;
    tanggal: string;
    tempat_surat: string;
    lampiran: string;
    isi_surat: string;
    penerima: string;
    pengirim: string;
    jabatan_pengirim: string;
    gambar: string;
    keterangan_gambar: string;
    sifat_surat: string;
    surat_nomor: string; // Tambahkan ini jika belum ada
    keterangan: string;
};

export type UpdateSuratkeluarRequest = {
    tanggal?: Date;
    tempat_surat?: string;
    lampiran?: string;
    isi_surat?: string;
    penerima?: string;
    pengirim?: string;
    jabatan_pengirim?: string;
    keterangan_gambar?: string;
    sifat_surat?: string;
    gambar?: string;
};

export type SuratkeluarResponse = {
    id: string;
    tanggal: Date;
    tempat_surat: string;
    lampiran: string;
    isi_surat: string;
    penerima: string;
    pengirim: string;
    jabatan_pengirim: string;
    gambar: string;
    keterangan_gambar: string;
    sifat_surat: string;
    user_id: string;
    surat_nomor: string; 
};

export function toSuratkeluarReponse(suratKeluar: SuratKeluar): SuratkeluarResponse {
    return {
        id: suratKeluar.id,
        tanggal: suratKeluar.tanggal,
        tempat_surat: suratKeluar.tempat_surat,
        lampiran: suratKeluar.lampiran,
        isi_surat: suratKeluar.isi_surat,
        penerima: suratKeluar.penerima,
        pengirim: suratKeluar.pengirim,
        jabatan_pengirim: suratKeluar.jabatan_pengirim,
        gambar: suratKeluar.gambar,
        keterangan_gambar: suratKeluar.keterangan_gambar,
        sifat_surat: suratKeluar.sifat_surat,
        user_id: suratKeluar.user_id,
        surat_nomor: suratKeluar.surat_nomor,
    }
}


import { SuratMasuk } from "@prisma/client";
import prisma from "../../prisma";

// Define a PaginatedResponse type
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
export type CreateSuratmasukRequest = {
    no_surat_masuk: string;
    tanggal: string;  
    alamat: string;
    perihal: string;
    tujuan: string;
    organisasi: string;
    pengirim: string;
    penerima: string;
    sifat_surat: string;
    scan_surat: string;
    expired_data: string;  
    user_id: string;
    kategori: string;
    diteruskan_kepada: string;
    tanggal_penyelesaian: string;
    isi_disposisi: string;
}


export type SuratmasukResponseWithoutDispoisi = {
    no_surat_masuk: string;
    tanggal: Date;
    alamat: string;
    perihal: string;
    tujuan: string;
    organisasi: string;
    pengirim: string;
    penerima: string;
    sifat_surat: string;
    scan_surat: string;
    expired_data: Date;
    user_id: string;
    tanggal_penyelesaian: string;
    isi_disposisi: string;
}

export function toSuratmasukResponseWithoutDisposisi(suratmasuk: SuratMasuk): SuratmasukResponseWithoutDispoisi {
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
    }
}
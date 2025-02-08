import { NomorSurat } from "@prisma/client";

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

export type CreateNomorSurat = {
    nomor_surat: string;
    keterangan: string;
    deskripsi: string;
};
export type UpdateNomorSuraRequest = {
    keterangan: string;
    deskripsi: string;
};


export type NomorSuratResponse = {
    nomor_surat: string;
    keterangan: string;
    deskripsi: string;
};

export function toNomorSuratResponse(nomorSurat: NomorSurat): NomorSuratResponse {
    return {
        nomor_surat: nomorSurat.nomor_surat,
        keterangan: nomorSurat.keterangan,
        deskripsi: nomorSurat.deskripsi,
    }
}
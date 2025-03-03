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
    created_by?: string;
    updated_by?: string;
};
export type UpdateNomorSuraRequest = {
    keterangan?: string;
    deskripsi?: string;
    createdAt?: string;
};


export type NomorSuratResponse = {
    nomor_surat: string;
    keterangan: string;
    deskripsi: string;
    created_by?: string;
    updated_by?: string;
    createdAt: string;
};

export function toNomorSuratResponse(nomorSurat: NomorSurat): NomorSuratResponse {
    return {
        nomor_surat: nomorSurat.nomor_surat,
        keterangan: nomorSurat.keterangan,
        deskripsi: nomorSurat.deskripsi,
        createdAt: nomorSurat.createdAt ? nomorSurat.createdAt.toISOString() : "",
        created_by: nomorSurat.created_by || "",
        updated_by: nomorSurat.updated_by || "",
    }
}
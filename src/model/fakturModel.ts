import { Faktur, NomorSurat } from "@prisma/client";

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

export type CreateFakturRequest = {
    bukti_pembayaran: string;
    deskripsi: string;
};
export type UpdateNomorSuraRequest = {
    bukti_pembayaran: string;
    deskripsi: string;
};


export type FakturResponse = {
    id: string;
    bukti_pembayaran: string;
    deskripsi: string;
};

export function toFakturResponse(faktur: Faktur): FakturResponse {
    return {
        id: faktur.id,
        bukti_pembayaran: faktur.bukti_pembayaran,
        deskripsi: faktur.deskripsi,
    }
}
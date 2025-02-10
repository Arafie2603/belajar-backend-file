import { Notulen } from "@prisma/client";



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



export type CreateNotulenRequest = {
    id: String; 
    judul: String; 
    tanggal_rapat: String;
    lokasi: String;
    pemimpin_rapat: String;
    peserta: String;
    agenda: String;
    dokumen_lampiran: String;
    status: String;
    user_id: String;
}

export type UpdateNotulenRequest = {
    judul: String; 
    tanggal_rapat: String;
    lokasi: String;
    pemimpin_rapat: String;
    peserta: String;
    agenda: String;
    dokumen_lampiran: String;
    status: String;
} 

export type NotulenResponse = {
    id: String; 
    judul: String; 
    tanggal_rapat: Date;
    lokasi: String;
    pemimpin_rapat: String;
    peserta: String;
    agenda: String;
    dokumen_lampiran: String;
    status: String;
    updated_by: String;
    created_by: String;
    user_id: String;
} 

export function toNotulenResponse(notulen: Notulen): NotulenResponse {
    return {
        id: notulen.id,
        judul: notulen.judul,
        tanggal_rapat: notulen.tanggal_rapat,
        lokasi: notulen.lokasi,
        pemimpin_rapat: notulen.pemimpin_rapat,
        peserta: notulen.peserta,
        agenda: notulen.agenda,
        dokumen_lampiran: notulen.dokumen_lampiran,
        status: notulen.status,
        updated_by: notulen.updated_by,
        created_by: notulen.created_by,
        user_id: notulen.user_id,
    }
}




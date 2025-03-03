import { Faktur, User } from "@prisma/client";

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
    bukti_pembayaran?: string;
    deskripsi: string;
    jumlah_pengeluaran?: number; 
    metode_pembayaran: string;
    status_pembayaran: string;
};

export type UpdateFakturRequest = {
    bukti_pembayaran?: string;   
    deskripsi: string;          
    jumlah_pengeluaran: number; 
    metode_pembayaran?: string;  
    status_pembayaran?: string;  
};

export type UserResponse = {
    id: string,
    nama: string;
    jabatan: string;
    nomor_identitas: string;
};

export type FakturResponse = {
    id: string;
    bukti_pembayaran: string;
    deskripsi: string;
    jumlah_pengeluaran?: number; 
    metode_pembayaran: string;
    status_pembayaran: string;
    tanggal: string;
    updated_by: string;
    created_by: string;
    user?: UserResponse; 
};

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        nama: user.nama,
        jabatan: user.jabatan || "",
        nomor_identitas: user.nomor_identitas,
    };
}

export function toFakturResponse(faktur: Faktur & { user?: User }): FakturResponse {
    return {
        id: faktur.id,
        bukti_pembayaran: faktur.bukti_pembayaran,
        deskripsi: faktur.deskripsi,
        jumlah_pengeluaran: faktur.jumlah_pengeluaran ? Number(faktur.jumlah_pengeluaran) : undefined,
        metode_pembayaran: faktur.metode_pembayaran,
        status_pembayaran: faktur.status_pembayaran,
        user: faktur.user ? toUserResponse(faktur.user) : undefined, 
        tanggal: faktur.tanggal ? faktur.tanggal.toISOString() : "",
        created_by: faktur.created_by || "",
        updated_by: faktur.updated_by || "",
    };
}

import { Prisma } from "@prisma/client";

export type UserResponse = {
    id: string,
    nama: string;
    foto?: string;
    alamat?: string;
    fakultas: string;
    prodi: string;
    jabatan: string;
    nomor_identitas: string;
    password: string;
    no_telp: string;
    role?: string | null;
};

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        currentPage: number;
        offset: number;
        itemsPerPage: number;
        unpaged: boolean;
        totalPages: number;
        totalItems: number;
        sortBy: string[];
        filter: object;
    }
};

export type CreateUserRequest = {
    nama: string;
    foto?: string;
    alamat: string;
    fakultas: string;
    prodi: string;
    jabatan: string;
    nomor_identitas: string;
    password: string;
    no_telp: string;
    role_id?: string; 
};

export type LoginUserRequest = {
    nomor_identitas: string;
    password: string;
};

export type UserWithRole = Prisma.UserGetPayload<{
    include: { role: true };
}>;


export function toUserResponse(user: UserWithRole): UserResponse {
    return {
        id: user.id,
        nama: user.nama,
        nomor_identitas: user.nomor_identitas,
        fakultas: user.fakultas || "",
        prodi: user.prodi || "",
        foto: user.foto || "",
        alamat: user.alamat || "",
        jabatan: user.jabatan || "",
        password: user.password || "",
        no_telp: user.no_telp || "",
        role: user.role?.nama, 
    };
}
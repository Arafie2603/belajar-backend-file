import { Prisma } from "@prisma/client";

export type UserResponse = {
    id: string,
    nomor_identitas: string;
    nama: string;
    password: string;
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
    nomor_identitas: string;
    password: string;
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
        password: user.password || "",
        role: user.role?.nama, 
    };
}
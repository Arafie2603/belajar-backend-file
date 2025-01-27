import { Prisma } from "@prisma/client";

export type UserResponse = {
    id_user: string;
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
    id_user: string;
    password: string;
    role_id?: string; 
};

export type LoginUserRequest = {
    id_user: string;
    password: string;
};

type UserWithRole = Prisma.UserGetPayload<{
    include: { role: true };
}>;

export function toUserResponse(user: UserWithRole): UserResponse {
    return {
        id_user: user.id_user,
        password: user.password || "",
        role: user.role?.nama, 
    };
}
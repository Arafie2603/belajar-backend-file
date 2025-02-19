import { v4 as uuidv4 } from 'uuid';
import { CreateUserRequest, LoginUserRequest, PaginatedResponse, toUserResponse, UserResponse, UserWithRole } from "../model/userModel";
import { userValidation } from "../validation/userValidation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { responseError } from "../error/responseError";
import bcrypt from "bcrypt";
import { createToken } from '../middleware/authMiddleware';

export class userService {
    static async getAllUsers(page: number = 1, totalData: number = 10): Promise<PaginatedResponse<UserResponse>> {
        const skip = (page - 1) * totalData;
        const take = totalData;

        const [users, totalItems] = await Promise.all([
            prismaClient.user.findMany({
                skip,
                take,
                include: { role: true },
            }),
            prismaClient.user.count()
        ]);

        const totalPages = Math.ceil(totalItems / totalData);

        return {
            data: users.map(toUserResponse),
            meta: {
                currentPage: page,
                offset: skip,
                itemsPerPage: totalData,
                unpaged: false,
                totalPages,
                totalItems,
                sortBy: [],
                filter: {},
            }
        }
    }

    static async getUserById(id: string): Promise<UserWithRole> {
        const user = await prismaClient.user.findUnique({
            where: {
                id: id,
            },
            include: {
                role: true,
            }
        });

        if (!user) {
            throw new responseError(404, "User Not Found");
        }
        return user;
    }


    static async register(request: CreateUserRequest): Promise<{ user: UserResponse, token: string }> {
        console.log("Received request:", request);
        const registerRequest = Validation.validate(userValidation.REGISTER, request);

        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                nomor_identitas: registerRequest.nomor_identitas,
                nama: registerRequest.nama
            },
        });

        if (totalUserWithSameUsername !== 0) {
            throw new responseError(400, "Nomor identitas already exists");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const { role_id, ...userData } = registerRequest;

        const user = await prismaClient.user.create({
            data: {
                id: uuidv4(),
                ...userData,
                role: role_id ? { connect: { role_id } } : { create: { role_id: uuidv4(), nama: 'user' } },
            },
            include: {
                role: true,
            },
        });
        const token = createToken(user);

        console.log("User created:", user);
        return {
            user: toUserResponse(user),
            token,

        }
    }

    static async login(request: LoginUserRequest): Promise<{ user: UserResponse, token: string }> {
        const loginRequest = Validation.validate(userValidation.LOGIN, request);

        const user = await prismaClient.user.findUnique({
            where: {
                nomor_identitas: loginRequest.nomor_identitas,
            },
            include: {
                role: true,
            },
        });

        if (!user) {
            throw new responseError(401, "Email or password is wrong");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new responseError(401, "Email or password is wrong");
        }

        const token = createToken(user);

        return {
            user: toUserResponse(user),
            token,
        };
    }

    static async updateUser(nomor_identitas: string, request: Partial<CreateUserRequest>): Promise<UserResponse> {
        const updateRequest = Validation.validate(userValidation.UPDATE, request);

        const checkedUser = await prismaClient.user.findUnique({
            where: { 
                nomor_identitas: nomor_identitas
            }
        })
        if (updateRequest.password) {
            updateRequest.password = await bcrypt.hash(updateRequest.password, 10);
        }

        if (!checkedUser) {
            throw new responseError(404, "Nomor identitas not found");
        }

        const { role_id, password, ...userData } = updateRequest;
        const user = await prismaClient.user.update({
            where: {
                nomor_identitas: nomor_identitas,
            },
            data: {
                ...userData,
                role_id: role_id ? { connect: { role_id: role_id } } : undefined,
            },
            include: {
                role: true,
            },
        });

        return toUserResponse(user);
    }

    static async deleteUser(nomor_identitas: string): Promise<void> {
        const checkedUser = await prismaClient.user.findUnique({
            where: { nomor_identitas: nomor_identitas },
        });

        if (!checkedUser) {
            throw new responseError(404, "Nomor identitas not found");
        }
        await prismaClient.user.delete({
            where: {
                nomor_identitas: nomor_identitas,
            }
        });
    }

    static async logout(token: string): Promise<void> {
        try {
            if (!token) {
                throw new responseError(400, "Token is required");
            }

            // Cek apakah token sudah ada di blacklist
            const existingToken = await prismaClient.tokenBlacklist.findUnique({
                where: { token }
            });

            if (existingToken) {
                // Token sudah di-blacklist, anggap logout berhasil
                return;
            }

            // Tambahkan token ke blacklist
            await prismaClient.tokenBlacklist.create({
                data: {
                    token
                }
            });
        } catch (error) {
            console.error('Error during logout service:', error);
            if (error instanceof responseError) {
                throw error;
            }
            throw new responseError(500, "Failed to logout");
        }
    }

    static async isTokenBlacklisted(token: string): Promise<boolean> {
        try {
            const blacklistedToken = await prismaClient.tokenBlacklist.findUnique({
                where: { token }
            });
            return !!blacklistedToken;
        } catch (error) {
            console.error('Error checking token blacklist:', error);
            throw new responseError(500, "Failed to check token status");
        }
    }

    
}

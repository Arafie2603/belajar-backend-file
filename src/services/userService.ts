import { v4 as uuidv4 } from 'uuid';
import { CreateUserRequest, LoginUserRequest, PaginatedResponse, toUserResponse, UserResponse } from "../model/userModel";
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

    static async register(request: CreateUserRequest): Promise<{ user: UserResponse, token: string}> {
        console.log("Received request:", request); 
        const registerRequest = Validation.validate(userValidation.REGISTER, request);
    
        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                id: registerRequest.id,
            },
        });
    
        if (totalUserWithSameUsername !== 0) {
            throw new responseError(400, "Email already exists");
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

    static async login(request: LoginUserRequest): Promise<{user: UserResponse, token: string}> {
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

    static async updateUser(userId: string, request: Partial<CreateUserRequest>): Promise<UserResponse> {
        const updateRequest = Validation.validate(userValidation.UPDATE, request);

        if (updateRequest.password) {
            updateRequest.password = await bcrypt.hash(updateRequest.password, 10);
        }

        const { role_id, ...userData } = updateRequest;
        const user = await prismaClient.user.update({
            where: {
                id: userId,
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

    static async deleteUser(userId: string): Promise<void> {
        await prismaClient.user.delete({
            where: {
                id: userId,
            }
        });
    }
}

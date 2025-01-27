import { v4 as uuidv4 } from 'uuid';
import { CreateUserRequest, LoginUserRequest, PaginatedResponse, toUserResponse, UserResponse } from "../model/userModel";
import { userValidation } from "../validation/userValidation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { responseError } from "../error/responseError";
import bcrypt from "bcrypt";

export class userService {
    static async getAllUsers(page: number = 1, totalData: number = 10): Promise<PaginatedResponse<UserResponse>> {
        const skip = (page - 1) * totalData;
        const take = totalData;

        const [users, totalItems] = await Promise.all([
            prismaClient.user.findMany({
                skip,
                take,
                include: { role: true },
                orderBy: {
                    createdAt: 'desc',
                }
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

    static async register(request: CreateUserRequest): Promise<UserResponse> {
        console.log("Received request:", request); // Tambahkan log ini
        const registerRequest = Validation.validate(userValidation.REGISTER, request);
    
        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                id_user: registerRequest.id_user,
            },
        });
    
        if (totalUserWithSameUsername !== 0) {
            throw new responseError(400, "Email already exists");
        }
    
        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    
        const { role_id, ...userData } = registerRequest;
    
        const user = await prismaClient.user.create({
            data: {
                id_user: uuidv4(),
                ...userData,
                role: role_id ? { connect: { role_id } } : { create: { role_id: uuidv4(), nama: 'user' } },
            },
            include: {
                role: true,
            },
        });
    
        return toUserResponse(user);
    }
    
    
    

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(userValidation.LOGIN, request);
    
        const user = await prismaClient.user.findUnique({
            where: {
                id_user: loginRequest.id_user,
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
    
        return toUserResponse(user);
    }
    
    
}
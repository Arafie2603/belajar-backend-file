import { NextFunction, Request, Response } from 'express';
import { CreateUserRequest, LoginUserRequest, toUserResponse, UserResponse } from "../model/userModel";
import { userService } from '../services/userService';
import { prismaClient } from '../application/database';

export class usersController {
    static async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const totalData = parseInt(req.query.totalData as string) || 10;
            const response = await userService.getAllUsers(page, totalData);
            res.status(200).json({
                data: {
                    paginatedData: response.data,
                    meta: response.meta,
                },
                status: 200,
                message: 'Users retrieved successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                status: 500,
                errors: error.message,
            });
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await userService.register(request);
            res.status(201).json({
                data: response,
                status: 201,
                message: 'User created successfully'
            });
        } catch (error: any) {
            if (error.status === 400) {
                res.status(400).json({
                    status: 400,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error',
                    errors: error.message || null,
                });
            }
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const user = await userService.login(request); // Perbaikan di sini
            res.status(200).json({
                data: user, // Sesuaikan respons di sini
                status: 200,
                message: 'Successfully logged in'
            });
        } catch (error: any) {
            if (error.status === 401) {
                res.status(401).json({
                    status: 401,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error',
                    errors: error.message || null,
                });
            }
        }
    }
}

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
            console.error("Error retrieving users:", error);
            res.status(500).json({
                status: 500,
                errors: error.message,
            });
        }
    }
    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const authRequest = req.user?.id;
            if (authRequest) {
                const userProfile = await userService.getUserById(authRequest);
                res.status(200).json({
                    data: toUserResponse(userProfile),
                    status: 200,
                    message: 'Profile retrieved successfully',
                });
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Profile user not found",
                });
            }
        } catch (error: any) {
            console.error("Error retrieving profile:", error); // Tambahkan log error
            if (error.status === 404) {
                res.status(404).json({
                    status: 404,
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

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            console.log("Register attempt:", request); 
            const response = await userService.register(request, req.file);
            res.status(201).json({
                data: response,
                status: 201,
                message: 'User created successfully'
            });
        } catch (error: any) {
            console.error("Error registering user:", error); 
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
            console.log("Login attempt:", req.body);
            const response = await userService.login(request);
            res.status(200).json({
                data: {
                    user: response.user,
                    token: response.token
                },
                status: 200,
                message: 'Successfully logged in'
            });
        } catch (error: any) {
            console.error("Error logging in:", error);
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

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const updateUser = await userService.updateUser(id, req.body, req.file);
            res.status(200).json({
                data: updateUser,
                status: 200,
                message: 'User updated successfully',
            });

            if (!updateUser) {
                res.status(404).json({
                    status: 404,
                    message: "Nomor identitas not found"
                });
            }
        } catch (error: any) {
            res.status(error.status || 500).json({
                status: error.status || 500,
                message: error.message,
                errors: error.errors || null,
            });
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { nomor_identitas } = req.params;
            await userService.deleteUser(nomor_identitas);

            res.status(200).json({
                status: 200,
                message: 'User deleted successfully',
            });
        } catch (error: any) {
            console.error("Error deleting user:", error); // Tambahkan log error
            if (error.status === 404) {
                res.status(404).json({
                    status: 404,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error',
                });
            }
        }
    }


    static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({
                    status: 401,
                    message: 'No token provided'
                });
                return;
            }

            const token = authHeader.split(' ')[1];
            await userService.logout(token);

            res.status(200).json({
                status: 200,
                message: 'Logout successful'
            });
        } catch (error) {
            console.error('Error during logout:', error);
            if (error instanceof Error) {
                res.status(500).json({
                    status: 500,
                    message: error.message || 'Internal server error'
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: 'Internal server error'
                });
            }
        }
    }

}

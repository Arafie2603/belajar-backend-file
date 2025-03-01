import { Request, Response, NextFunction, response } from 'express';
import { NotulenService } from '../services/notulenService';
import { CreateNotulenRequest, UpdateNotulenRequest } from '../model/notulenModel';
import { responseError } from '../error/responseError';

export class NotulenController {
    static async createNotulen(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
                return;
            }
    
            console.log("File from request:", req.file); 
    
            const requestData = { ...req.body };
    
            const notulen = await NotulenService.createNotulen(
                requestData,
                req.user.id,
                req.file // Pass file if exists
            );
    
            res.status(201).json({
                status: 201,
                data: notulen,
                message: "Notulen created successfully",
            });
        } catch (error) {
            console.error('Error creating Notulen:', error);
    
            if (res.headersSent) {
                return;
            }
    
            if (error instanceof responseError) {
                res.status(error.status).json({
                    status: error.status,
                    message: error.message
                });
                return;
            }
    
            res.status(500).json({
                status: 500,
                message: 'Internal server error'
            });
        }
    }

    static async getAllNotulen(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const totalData = parseInt(req.query.totalData as string) || 10;
            const status = req.query.status as string | undefined;
            const judul = req.query.judul as string | undefined;

            const response = await NotulenService.getAllNotulen(page, totalData, status, judul);

            res.status(200).json({
                data: {
                    paginatedData: response.data,
                    meta: response.meta,
                },
                status: 200,
                message: 'Surat keluar retrieved successfully',
            });
        } catch (error: any) {
            if (error instanceof responseError) {
                res.status(404).json({
                    status: 404,
                    message: error.message
                });
            }
            res.status(500).json({
                data: response,
                errors: error.message || null,
            });
        }
    }

    static async getNotulenById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            const notulen = await NotulenService.getNotulenById(id);
            res.status(200).json({
                message: "Notulen retrieved successfully",
                data: notulen
            });
        } catch (error) {
            if (error instanceof responseError) {
                res.status(error.status).json({
                    status: error.status,
                    message: error.message,
                });
            } else {
                console.error('Error updating faktur:', error);
                res.status(500).json({
                    status: 500,
                    message: "Internal server error"
                });
            }
            next(error);
        }
    }

    static async updateNotulen(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        const request: UpdateNotulenRequest = req.body;

        try {
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
                return;
            }

            const updatedNotulen = await NotulenService.updateNotulen(req.user.id, id, request, req.file);
            res.status(200).json({
                message: "Notulen updated successfully",
                data: updatedNotulen
            });
        } catch (error) {
            if (error instanceof responseError) {
                res.status(error.status).json({
                    status: error.status,
                    message: error.message
                });
            } else {
                console.error('Error updating Notulen:', error);
                res.status(500).json({
                    status: 500,
                    message: "Internal server error"
                });
            }
            next(error);
        }
    }


    static async deleteNotulen(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            await NotulenService.deleteNotulen(id);
            res.status(200).json({
                status: 200,
                message: "Notulen deleted successfully"
            });
        } catch (error) {
            if (error instanceof responseError) {
                res.status(404).json({
                    status: 404,
                    message: "Notulen ID not found"
                });
            }
            console.error('Error deleting Notulen:', error);
            res.status(500).json({
                status: 500,
                message: "Internal server error"
            })
        }
    }
}

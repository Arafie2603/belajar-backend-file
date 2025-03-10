import { Request, Response, NextFunction, response } from 'express';
import { FakturService } from '../services/fakturService';
import { CreateFakturRequest, UpdateFakturRequest } from '../model/fakturModel';
import { responseError } from '../error/responseError';

export class FakturController {
    static async createFaktur(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ status: 401, message: 'Unauthorized' });
                return;
            }
            console.log('Request body in controller:', req.body.tanggal);
    
            const faktur = await FakturService.createFaktur(req.body, req.user.id, req.file);
            res.status(201).json({
                status: 201,
                data: faktur,
                message: "Faktur created successfully"
            });
            return;
        } catch (error) {
            if (error instanceof responseError) {
                res.status(error.status).json({ status: error.status, message: error.message });
                return;
            }
            
            console.error('Unexpected Error:', error);
            res.status(500).json({ status: 500, message: "Internal server error" });
        }
    }
    

    static async getFakturById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            const faktur = await FakturService.getFakturById(id);
            res.status(200).json({
                status: 200,
                data: faktur,
                message: "Faktur retrieved successfully"
            });
        } catch (error) {
            if (error instanceof responseError) {
                res.status(error.status).json({
                    status: error.status,
                    message: error.message
                });
            } else {
                console.error('Error retrieving faktur:', error);
                res.status(500).json({
                    status: 500,
                    message: "Internal server error"
                });
            }
            next(error);
        }
    }

    static async updateFaktur(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        const request: UpdateFakturRequest = req.body;

        try {
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
                return;
            }

            const faktur = await FakturService.updateFaktur(id, req.user?.id, request, req.file);

            res.status(200).json({
                status: 200,
                data: faktur,
                message: "Faktur updated successfully"
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

    static async deleteFaktur(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;

        try {
            await FakturService.deleteFaktur(id);
            res.status(200).json({
                status: 200,
                message: "Faktur deleted successfully"
            });
        } catch (error) {
            if (error instanceof responseError) {
                res.status(error.status).json({
                    status: error.status,
                    message: error.message
                });
            } else {
                console.error('Error deleting faktur:', error);
                res.status(500).json({
                    status: 500,
                    message: "Internal server error"
                });
            }
            next(error);
        }
    }

    static async getAllFaktur(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const totalData = parseInt(req.query.totalData as string) || 10;
            const deskripsi = req.query.deskripsi as string | undefined;

            const response = await FakturService.getAllFaktur(page, totalData, deskripsi);

            res.status(200).json({
                data: {
                    paginatedData: response.data,
                    meta: response.meta,
                },
                status: 200,
                message: 'Faktur retrieved successfully',
            });
        } catch (error: any) {
            if (error.StatusCode === 401) {
                res.status(error.status).json({
                    status: error.status,
                    message: "Unauthorized",
                });
            } else if (error.StatusCode === 400) {
                res.status(error.status).json({
                    status: error.status,
                    message: "invalid Request",
                });
            }
            else {
                res.status(500).json({
                    status: 500,
                    message: "Internal server error"
                });
            }
        }
    }
}
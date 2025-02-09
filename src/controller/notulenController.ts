import { Request, Response, NextFunction } from 'express';
import { NotulenService } from '../services/notulenService';
import { CreateNotulenRequest, UpdateNotulenRequest } from '../model/notulenModel';
import { responseError } from '../error/responseError';

export class NotulenController {
    static async createNotulen(req: Request, res: Response, next: NextFunction): Promise<void> {
        const request: CreateNotulenRequest = req.body;

        try {
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
                return;
            }
            const notulen = await NotulenService.createNotulen(request, req.user.id);
            res.status(201).json({
                status: 201,
                data: notulen,
                message: "Notulen created successfully",
            });
        } catch (error) {
            console.error('Error creating Notulen:', error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
            });
            next(error);
        }
    }

    static async getNotulenById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const notulen = await NotulenService.getNotulenById(id);
            return res.status(200).json({
                message: "Notulen retrieved successfully",
                data: notulen
            });
        } catch (error) {
            console.error('Error getting Notulen by ID:', error);
            next(error);
        }
    }

    static async updateNotulen(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const request: UpdateNotulenRequest = req.body;

        try {
            const updatedNotulen = await NotulenService.updateNotulen(id, request);
            return res.status(200).json({
                message: "Notulen updated successfully",
                data: updatedNotulen
            });
        } catch (error) {
            console.error('Error updating Notulen:', error);
            next(error);
        }
    }

    static async deleteNotulen(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            await NotulenService.deleteNotulen(id);
            return res.status(200).json({
                message: "Notulen deleted successfully"
            });
        } catch (error) {
            console.error('Error deleting Notulen:', error);
            next(error);
        }
    }
}

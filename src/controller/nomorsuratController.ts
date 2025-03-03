import { NextFunction , Response, Request, response} from "express";
import { CreateNomorSurat, UpdateNomorSuraRequest } from "../model/nomorsuratModel";
import { nomorService } from "../services/nomorsuratService";
import { responseError } from "../error/responseError";




export class nomorsuratController {
    static async getAllNomorsurat(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const totalData = parseInt(req.query.totalData as string) || 10;
            const kategori = req.query.kategori as string | undefined;

            const response = await nomorService.getAllnomorSurat(page, totalData, kategori);

            res.status(200).json({
                data: {
                    paginatedData: response.data,
                    meta: response.meta,
                },
                status: 200,
                message: 'Surat masuk retrieved successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                data: response,
                errors: error.message || null,
            });
        }
    }

    static async getNomorSuratById(req: Request, res: Response) {
        try {
            const id: string = req.params.id;

            console.log(id)
            const suratkeluar = await nomorService.getNomorSuratById(id);

            if (suratkeluar) {
                res.status(200).json({
                    status: 200,
                    data: suratkeluar,
                    message: 'Nomor surat retrieved successfully',
                });
            } 
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

    static async createnomorSurat(req: Request, res: Response): Promise<void> {
        try {
            const request = req.body;
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
                return;
            }
            
            console.log(request);
            const nomorSurat = await nomorService.createNomorSurat(request, req.user.id);
            res.status(200).json({
                status: 200,
                data: nomorSurat,
                message: 'Nomor surat created successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                errors: error.message,
            });
        }
    }

    static async updateNomorSurat(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const request: UpdateNomorSuraRequest = req.body;

        try {
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
                return;
            }
            const updatedNomorSurat = await nomorService.updateNomorSurat(id, request, req.user.id);
            res.status(200).json({
                message: "NomorSurat updated successfully",
                data: updatedNomorSurat
            });
        } catch (error) {
            if (error instanceof responseError) {
                res.status(404).json({
                    status: 404,
                    message: error.message
                });
            } else {
                console.error('Error updating NomorSurat:', error);
                res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error'
                });
            }
            next(error);  
        }
    }
    static async deleteNomorSurat(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            await nomorService.deleteNomorSurat(id);
            res.status(200).json({
                status: 200,
                message: "NomorSurat deleted successfully"
            });
        } catch (error) {
            if (error instanceof responseError) {
                res.status(404).json({
                    status: 404,
                    message: error.message
                });
            } else {
                console.error('Error deleting NomorSurat:', error);
                res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error'
                });
            }
            next(error);  
        }
    }
    
}
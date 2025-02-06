import { NextFunction, Request, Response, response } from "express"
import { SuratKeluarService } from "../services/suratkeluarService";
import { suratmasukService } from "../services/suratmasukService";




export class suratkeluarController {
    static async getAllSuratmasuk(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const totalData = parseInt(req.query.totalData as string) || 10;
            const tujuan = req.query.tujuan as string | undefined;
            const kategori = req.query.kategori as string | undefined;

            const response = await suratmasukService.getAllSuratMasuk(page, totalData, kategori, tujuan);

            res.status(200).json({
                data: {
                    paginatedData: response.data,
                    meta: response.meta,
                },
                status: 200,
                message: 'Surat keluar retrieved successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                data: response,
                errors: error.message || null,
            });
        }
    }
    static async CreateSuratKeluar(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: 'User not authenticated',
                });
                return;
            }

            console.log('Authenticate user: ', req.user);

            if (!req.file) {
                res.status(400).json({
                    status: 400,
                    message: 'File is required',
                    errors: 'No file uploaded',
                });
                return;
            }

            const suratkeluar = await SuratKeluarService.createSuratkeluar(
                req.body,
                req.file,
                req.user.id,
            );

            res.status(201).json({
                data: suratkeluar,
                status: 201,
                message: 'Surat keluar created successfully',
            });
        } catch (error: any) {
            console.log(error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                errors: error.message,
            });
        }
    }
}
import { NextFunction, Request, response, Response } from 'express';
import { suratmasukService } from '../services/suratmasukService';

export class suratmasukController {

    static async getAllSuratmasuk(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const totalData = parseInt(req.query.totalData as string) || 10;
            const tujuan = req.query.tujuan as string | undefined;
            const kategori = req.query.kategori as string | undefined;
            const organisasi = req.query.organisasi as string | undefined;

            const response = await suratmasukService.getAllSuratMasuk(page, totalData, organisasi, tujuan);

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

    static async getSuratmasukById(req: Request, res: Response) {
        try {
            const no_surat_masuk: string = req.params.no_surat_masuk;

            console.log(no_surat_masuk)
            const suratmasuk = await suratmasukService.getSuratmasukById(no_surat_masuk);

            if (suratmasuk) {
                res.status(200).json({
                    status: 200,
                    data: suratmasuk,
                    message: 'Surat masuk retrieved successfully',
                });
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'Surat masuk not found'
                });
            }
        } catch (error: any) {
            res.status(500).json({
                data: response,
                errors: error.message || null,
            });
        }
    }

    static async createSuratmasuk(req: Request, res: Response): Promise<void> {
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

            const suratMasuk = await suratmasukService.createSuratmasuk(
                req.body,
                req.file,
                req.user.id
            );

            res.status(201).json({
                data: suratMasuk,
                status: 201,
                message: 'Surat Masuk created successfully',
            });
        } catch (error: any) {
            console.error('Error occurred:', error);
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                errors: error.message,
            });
        }
    }

    static async updateSuratmasuk(req: Request, res: Response) {
        try {
            // Ubah dari suratmasukId menjadi no_surat_masuk
            const { no_surat_masuk } = req.params;  // Sesuaikan dengan nama parameter di route
            const userId = req.user?.id || '';
            const file = req.file || null; 
            
            console.log("Request Body:", req.body); // Tambahkan log untuk debugging

            
            const updatedSuratmasuk = await suratmasukService.updateSuratmasuk(
                no_surat_masuk,
                req.body,
                file,
                userId
            );

            if (!updatedSuratmasuk) {
                res.status(400).json({
                    status: 200,
                    message: `Surat masuk with ID ${no_surat_masuk} $`
                });
            }
            
            res.status(200).json({
                status: 'success',
                data: updatedSuratmasuk
            });
        } catch (error: any) {
            console.error("Update Error:", error); // Tambahkan log error
            res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    }
    static async deleteSuratmasuk(req: Request, res: Response) {
        try {
            const { no_surat_masuk } = req.params;
            await suratmasukService.deleteSuratmasuk(no_surat_masuk);
            res.status(200).json({ 
                status: 200,
                message: 'Suratmasuk deleted successfully',
            });
        } catch (error: any) {
            res.status(500).json({
                status: 500,
                message: error.message
            });
        }
    }
}

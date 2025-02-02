import { Request, Response } from 'express';
import { suratmasukService } from '../services/suratmasukService';

export class suratmasukController {
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
            
            res.status(200).json({
                status: 'success',
                data: updatedSuratmasuk
            });
        } catch (error: any) {
            console.error("Update Error:", error); // Tambahkan log error
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    static async deleteSuratmasuk(req: Request, res: Response) {
        try {
            const { suratmasukId } = req.params;

            await suratmasukService.deleteSuratmasuk(suratmasukId);
            res.status(200).json({ message: 'Suratmasuk deleted successfully' });
        } catch (error: any) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

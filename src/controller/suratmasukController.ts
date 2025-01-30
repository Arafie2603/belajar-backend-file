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
    
}

import { Request, Response } from "express";
import { FileService } from "../services/fileService";
import mime from 'mime-types';

export class FileController {
    static async downloadFile(req: Request, res: Response) {
        try {
            const { fileName } = req.params;
            const bucketName = 'suratmasuk';

            const fileStream = await FileService.getFileStream(bucketName, fileName);
            
            // Deteksi content type
            const contentType = mime.lookup(fileName) || 'application/octet-stream';
            
            // Set headers
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            
            // Pipe file stream ke response
            fileStream.pipe(res);
        } catch (error) {
            console.error('Download error:', error);
            res.status(404).json({
                status: 'error',
                message: 'File tidak ditemukan atau tidak dapat diakses'
            });
        }
    }

    static async viewFile(req: Request, res: Response) {
        try {
            const { fileName } = req.params;
            const bucketName = 'suratmasuk';

            const fileStream = await FileService.getFileStream(bucketName, fileName);
            
            // Deteksi content type
            const contentType = mime.lookup(fileName) || 'application/octet-stream';
            
            // Set header untuk viewing
            res.setHeader('Content-Type', contentType);
            
            // Pipe file stream ke response
            fileStream.pipe(res);
        } catch (error) {
            console.error('View error:', error);
            res.status(404).json({
                status: 'error',
                message: 'File tidak ditemukan atau tidak dapat diakses'
            });
        }
    }

    static async getPresignedUrl(req: Request, res: Response) {
        try {
            const { fileName } = req.params;
            const bucketName = 'suratmasuk';

            const presignedUrl = await FileService.getFileUrl(bucketName, fileName);
            
            res.json({
                status: 'success',
                url: presignedUrl
            });
        } catch (error) {
            console.error('Presigned URL error:', error);
            res.status(404).json({
                status: 'error',
                message: 'Gagal menggenerate URL file'
            });
        }
    }
}
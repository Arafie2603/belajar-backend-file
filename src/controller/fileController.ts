import { Request, Response } from "express";
import { FileService } from "../services/fileService";
import mime from 'mime-types';

export class FileController {
    static async downloadFile(req: Request, res: Response) {
        try {
            const { fileName } = req.params;
            const bucketName = 'suratmasuk';

            const fileStream = await FileService.getFileStream(bucketName, fileName);

            const contentType = mime.lookup(fileName) || 'application/octet-stream';

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

            fileStream.pipe(res);
        } catch (error) {
            console.error('Download error:', error);
            res.status(404).json({
                status: 'error',
                message: 'File tidak ditemukan atau tidak dapat diakses'
            });
        }
    }

    static async viewFile(req: Request, res: Response): Promise<void> {
        try {
            const { fileName } = req.params;
            const bucketName = 'suratmasuk';
            const fileExtension = fileName.split('.').pop()?.toLowerCase();

            // Cek User-Agent untuk mendeteksi apakah request dari Swagger
            const userAgent = req.headers['user-agent'] || '';
            const isSwagger = userAgent.includes('Swagger');

            if (isSwagger) {
                // Jika dari Swagger, berikan response JSON dengan redirect URL
                const presignedUrl = await FileService.getFileUrl(bucketName, fileName);
                res.json({
                    status: 'success',
                    message: 'Gunakan URL berikut untuk melihat file',
                    viewUrl: presignedUrl
                });
            }

            // Proses normal untuk request non-Swagger
            if (fileExtension === 'pdf') {
                const reqParams = {
                    'response-content-type': 'application/pdf',
                    'response-content-disposition': 'inline'
                };
                const presignedUrl = await FileService.getFileUrl(bucketName, fileName, reqParams);
                return res.redirect(presignedUrl);
            } else {
                const fileStream = await FileService.getFileStream(bucketName, fileName);
                const contentType = mime.lookup(fileName) || 'application/octet-stream';

                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Disposition', 'inline');

                fileStream.pipe(res);
            }
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
            const fileExtension = fileName.split('.').pop()?.toLowerCase();

            const reqParams = fileExtension === 'pdf' ? {
                'response-content-type': 'application/pdf',
                'response-content-disposition': 'inline'
            } : undefined;

            const presignedUrl = await FileService.getFileUrl(bucketName, fileName, reqParams);

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
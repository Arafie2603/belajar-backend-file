// fileService.ts
import { minioClient } from "../helper/minioClient";

export class FileService {
    static async getFileStream(bucketName: string, fileName: string) {
        try {
            // Cek apakah file exists
            await minioClient.statObject(bucketName, fileName);
            
            // Get object
            return await minioClient.getObject(bucketName, fileName);
        } catch (error: any) {
            throw new Error(`Error getting file: ${error.message}`);
        }
    }

    static async getFileUrl(bucketName: string, fileName: string) {
        try {
            // Generate presigned URL yang valid selama 1 jam
            const presignedUrl = await minioClient.presignedGetObject(bucketName, fileName, 60 * 60);
            return presignedUrl;
        } catch (error: any) {
            throw new Error(`Error generating presigned URL: ${error.message}`);
        }
    }

    static extractFileNameFromUrl(fileUrl: string): string {
        const urlParts = fileUrl.split('/');
        return urlParts[urlParts.length - 1];
    }
}

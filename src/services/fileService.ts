// fileService.ts
import { minioClient } from "../helper/minioClient";

export class FileService {
    static async findFileInAllBuckets(fileName: string) {
        try {
            // Dapatkan semua bucket yang ada
            const buckets = await minioClient.listBuckets();
            
            // Cari file di setiap bucket
            for (const bucket of buckets) {
                try {
                    // Cek apakah file ada di bucket ini
                    await minioClient.statObject(bucket.name, fileName);
                    console.log(`File found in bucket: ${bucket.name}`);
                    // Jika file ditemukan, return bucket name dan file stream
                    return {
                        bucketName: bucket.name,
                        fileStream: await minioClient.getObject(bucket.name, fileName)
                    };
                } catch (error) {
                    // Lanjut ke bucket berikutnya jika file tidak ditemukan
                    continue;
                }
            }
            // Jika file tidak ditemukan di semua bucket
            throw new Error('File not found in any bucket');
        } catch (error: any) {
            console.error('Error searching file:', error);
            throw new Error(`Error searching file: ${error.message}`);
        }
    }

    static async getFileStream(bucketName: string, fileName: string) {
        try {
            // Coba cari di bucket spesifik dulu
            try {
                await minioClient.statObject(bucketName, fileName);
                return await minioClient.getObject(bucketName, fileName);
            } catch (error) {
                // Jika tidak ditemukan di bucket spesifik, cari di semua bucket
                console.log(`File not found in ${bucketName}, searching in all buckets...`);
                const result = await this.findFileInAllBuckets(fileName);
                return result.fileStream;
            }
        } catch (error: any) {
            console.error('MinIO Error:', error);
            throw new Error(`Error getting file: ${error.message}`);
        }
    }

    static async getFileUrl(bucketName: string, fileName: string) {
        try {
            // Coba cari di bucket spesifik dulu
            try {
                await minioClient.statObject(bucketName, fileName);
                return await minioClient.presignedGetObject(bucketName, fileName, 60 * 60);
            } catch (error) {
                // Jika tidak ditemukan di bucket spesifik, cari di semua bucket
                const result = await this.findFileInAllBuckets(fileName);
                return await minioClient.presignedGetObject(result.bucketName, fileName, 60 * 60);
            }
        } catch (error: any) {
            throw new Error(`Error generating presigned URL: ${error.message}`);
        }
    }

    static extractFileNameFromUrl(fileUrl: string): string {
        const urlParts = fileUrl.split('/');
        return urlParts[urlParts.length - 1];
    }
}
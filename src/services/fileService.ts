import { minioClient } from "../helper/minioClient";

export class FileService {
    static async findFileInAllBuckets(fileName: string) {
        try {
            const buckets = await minioClient.listBuckets();
            
            for (const bucket of buckets) {
                try {
                    await minioClient.statObject(bucket.name, fileName);
                    console.log(`File found in bucket: ${bucket.name}`);
                    return {
                        bucketName: bucket.name,
                        fileStream: await minioClient.getObject(bucket.name, fileName)
                    };
                } catch (error) {
                    continue;
                }
            }
            throw new Error('File not found in any bucket');
        } catch (error: any) {
            console.error('Error searching file:', error);
            throw new Error(`Error searching file: ${error.message}`);
        }
    }

    static async getFileStream(bucketName: string, fileName: string) {
        try {
            try {
                await minioClient.statObject(bucketName, fileName);
                return await minioClient.getObject(bucketName, fileName);
            } catch (error) {
                console.log(`File not found in ${bucketName}, searching in all buckets...`);
                const result = await this.findFileInAllBuckets(fileName);
                return result.fileStream;
            }
        } catch (error: any) {
            throw new Error(`Error getting file: ${error.message}`);
        }
    }

    static async getFileUrl(bucketName: string, fileName: string, reqParams?: any) {
        try {
            try {
                await minioClient.statObject(bucketName, fileName);
                return await minioClient.presignedGetObject(bucketName, fileName, 60 * 60, reqParams);
            } catch (error) {
                const result = await this.findFileInAllBuckets(fileName);
                return await minioClient.presignedGetObject(result.bucketName, fileName, 60 * 60, reqParams);
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
import { Client } from 'minio';

export const MINIO_ENDPOINT = 'localhost';  // or your actual MinIO server address
export const MINIO_PORT = 9000;  // Default MinIO API port
const MINIO_USE_SSL = false;
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;  // Replace with your access key
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;  // Replace with your secret key

export const minioClient = new Client({
    endPoint: MINIO_ENDPOINT,
    port: MINIO_PORT,
    useSSL: MINIO_USE_SSL,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY
});
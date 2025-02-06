import { Client } from 'minio';

// export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || '';
// export const MINIO_PORT = parseInt(process.env.MINIO_PORT || '443');
// const MINIO_USE_SSL = true;
// const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || '';
// const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || '';

// export const minioClient = new Client({
//     endPoint: MINIO_ENDPOINT,
//     port: MINIO_PORT,
//     useSSL: MINIO_USE_SSL,
//     accessKey: MINIO_ACCESS_KEY,
//     secretKey: MINIO_SECRET_KEY
// });

// Local
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || '127.0.0.1';
export const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9000');
const MINIO_USE_SSL = false;
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || '';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || '';

export const minioClient = new Client({
    endPoint: MINIO_ENDPOINT,
    port: MINIO_PORT,
    useSSL: MINIO_USE_SSL,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY
});
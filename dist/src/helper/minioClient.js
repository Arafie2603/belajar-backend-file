"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minioClient = exports.MINIO_PORT = exports.MINIO_ENDPOINT = void 0;
const minio_1 = require("minio");
exports.MINIO_ENDPOINT = 'localhost'; // or your actual MinIO server address
exports.MINIO_PORT = 9000; // Default MinIO API port
const MINIO_USE_SSL = false;
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY; // Replace with your access key
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY; // Replace with your secret key
exports.minioClient = new minio_1.Client({
    endPoint: exports.MINIO_ENDPOINT,
    port: exports.MINIO_PORT,
    useSSL: MINIO_USE_SSL,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY
});

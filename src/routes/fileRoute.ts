import express from 'express';
import { FileController } from '../controller/fileController';

const router = express.Router();

/**
 * @swagger
 * /api/files/download/{fileName}:
 *   get:
 *     summary: "Download file berdasarkan nama file"
 *     tags:
 *       - Files
 *     description: "Endpoint ini untuk mendownload file berdasarkan nama file"
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nama file yang akan didownload"
 *     responses:
 *       200:
 *         description: "File berhasil didownload"
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: "File tidak ditemukan atau tidak dapat diakses"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "File tidak ditemukan atau tidak dapat diakses"
 */
router.get('/download/:fileName', FileController.downloadFile);

/**
 * @swagger
 * /api/files/view/{fileName}:
 *   get:
 *     summary: "Melihat file gambar berdasarkan nama file"
 *     tags:
 *       - Files
 *     description: "Endpoint ini untuk melihat file gambar berdasarkan nama file"
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nama file yang akan dilihat"
 *     responses:
 *       200:
 *         description: "File gambar berhasil dilihat"
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: "File tidak ditemukan atau tidak dapat diakses"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "File tidak ditemukan atau tidak dapat diakses"
 */
router.get('/view/:fileName', FileController.viewFile);

// router.get('/url/:fileName', FileController.getPresignedUrl);

export default router;
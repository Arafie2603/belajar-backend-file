

import express from 'express';
import { NotulenController } from '../controller/notulenController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/mutler';


const router = express.Router();
/**
 * @swagger
 * /api/notulen:
 *   get:
 *     summary: "Mendapatkan semua notulen dengan pagination"
 *     tags:
 *       - Notulen
 *     description: "Endpoint ini untuk mendapatkan semua notulen dengan pagination, status, dan judul"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Nomor halaman yang akan diambil"
 *       - in: query
 *         name: totalData
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Jumlah data per halaman"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: "Status notulen"
 *       - in: query
 *         name: judul
 *         schema:
 *           type: string
 *         description: "Judul notulen"
 *     responses:
 *       200:
 *         description: "Notulen retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     paginatedData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           judul:
 *                             type: string
 *                           tanggal:
 *                             type: string
 *                             format: date-time
 *                           lokasi:
 *                             type: string
 *                           pemimpin_rapat:
 *                             type: string
 *                           peserta:
 *                             type: string
 *                           agenda:
 *                             type: string
 *                           dokumen_lampiran:
 *                             type: string
 *                           status:
 *                             type: string
 *                           updated_by:
 *                             type: string
 *                           created_by:
 *                             type: string
 *                           user_id:
 *                             type: string
 *                     meta:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         offset:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 *                         unpaged:
 *                           type: boolean
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         sortBy:
 *                           type: array
 *                           items:
 *                             type: string
 *                         filter:
 *                           type: object
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Surat keluar retrieved successfully"
 *       404:
 *         description: "Notulen tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Notulen not found"
 *       500:
 *         description: "Kesalahan internal server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/', authMiddleware, NotulenController.getAllNotulen);


/**
 * @swagger
 * /api/notulen/{id}:
 *   get:
 *     summary: "Mendapatkan notulen berdasarkan ID"
 *     tags:
 *       - Notulen
 *     description: "Endpoint ini untuk mendapatkan notulen berdasarkan ID"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID notulen yang akan diambil"
 *     responses:
 *       200:
 *         description: "Notulen retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notulen retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     judul:
 *                       type: string
 *                     tanggal:
 *                       type: string
 *                       format: date-time
 *                     lokasi:
 *                       type: string
 *                     pemimpin_rapat:
 *                       type: string
 *                     peserta:
 *                       type: string
 *                     agenda:
 *                       type: string
 *                     dokumen_lampiran:
 *                       type: string
 *                     status:
 *                       type: string
 *                     updated_by:
 *                       type: string
 *                     created_by:
 *                       type: string
 *                     user_id:
 *                       type: string
 *               example:
 *                 message: "Notulen retrieved successfully"
 *                 data:
 *                   id: "5dee1171-8a9a-4b75-a709-bf0db71bff45"
 *                   judul: "Rapat Bulanan"
 *                   tanggal: "2025-01-10T00:00:00.000Z"
 *                   lokasi: "Lampir"
 *                   pemimpin_rapat: "Isian"
 *                   peserta: "Ara"
 *                   agenda: "Aralasiasasa"
 *                   dokumen_lampiran: "http://192.168.1.4:9000/notulen/1739188926492-images.jpeg"
 *                   status: "Penting"
 *                   updated_by: "Aralasia"
 *                   created_by: "Aralasia"
 *                   user_id: "82fc65cf-9536-4fa1-8c18-c042f3d5e625"
 *       404:
 *         description: "Notulen tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/:id', authMiddleware, NotulenController.getNotulenById);


/**
 * @swagger
 * /api/notulen:
 *   post:
 *     summary: "Membuat notulen baru"
 *     tags:
 *       - Notulen
 *     description: "Endpoint ini untuk membuat notulen baru"
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               judul:
 *                 type: string
 *               tanggal:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-10"  # Nilai default untuk tanggal
 *               lokasi:
 *                 type: string
 *               pemimpin_rapat:
 *                 type: string
 *               peserta:
 *                 type: string
 *               agenda:
 *                 type: string
 *               dokumen_lampiran:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *               updated_by:
 *                 type: string
 *               created_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: "Notulen created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     judul:
 *                       type: string
 *                     tanggal:
 *                       type: string
 *                       format: date-time
 *                     lokasi:
 *                       type: string
 *                     pemimpin_rapat:
 *                       type: string
 *                     peserta:
 *                       type: string
 *                     agenda:
 *                       type: string
 *                     dokumen_lampiran:
 *                       type: string
 *                     status:
 *                       type: string
 *                     updated_by:
 *                       type: string
 *                     created_by:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Notulen created successfully"
 *               example:
 *                 status: 201
 *                 data:
 *                   id: "5dee1171-8a9a-4b75-a709-bf0db71bff45"
 *                   judul: "Rapat Bulanan"
 *                   tanggal: "2025-01-10T00:00:00.000Z"
 *                   lokasi: "Lampir"
 *                   pemimpin_rapat: "Isian"
 *                   peserta: "Ara"
 *                   agenda: "Aralasiasasa"
 *                   dokumen_lampiran: "http://192.168.1.4:9000/notulen/1739188926492-images.jpeg"
 *                   status: "Penting"
 *                   updated_by: "Aralasia"
 *                   created_by: "Aralasia"
 *                   user_id: "82fc65cf-9536-4fa1-8c18-c042f3d5e625"
 *                 message: "Notulen created successfully"
 *       500:
 *         description: "Kesalahan internal server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/', upload.single('dokumen_lampiran'), authMiddleware, NotulenController.createNotulen);

/**
 * @swagger
 * /api/notulen/{id}:
 *   patch:
 *     summary: "Memperbarui notulen berdasarkan ID"
 *     tags:
 *       - Notulen
 *     description: "Endpoint ini untuk memperbarui notulen berdasarkan ID"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID notulen yang akan diperbarui"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               judul:
 *                 type: string
 *               tanggal:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-10"  # Nilai default untuk tanggal
 *               lokasi:
 *                 type: string
 *               pemimpin_rapat:
 *                 type: string
 *               peserta:
 *                 type: string
 *               agenda:
 *                 type: string
 *               dokumen_lampiran:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *               updated_by:
 *                 type: string
 *               created_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Notulen updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notulen updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     judul:
 *                       type: string
 *                     tanggal:
 *                       type: string
 *                       format: date-time
 *                     lokasi:
 *                       type: string
 *                     pemimpin_rapat:
 *                       type: string
 *                     peserta:
 *                       type: string
 *                     agenda:
 *                       type: string
 *                     dokumen_lampiran:
 *                       type: string
 *                     status:
 *                       type: string
 *                     updated_by:
 *                       type: string
 *                     created_by:
 *                       type: string
 *                     user_id:
 *                       type: string
 *               example:
 *                 message: "Notulen updated successfully"
 *                 data:
 *                   id: "5dee1171-8a9a-4b75-a709-bf0db71bff45"
 *                   judul: "Rapat Bulanan"
 *                   tanggal: "2025-01-10T00:00:00.000Z"
 *                   lokasi: "Lampir"
 *                   pemimpin_rapat: "Isian"
 *                   peserta: "Ara"
 *                   agenda: "Aralasiasasa"
 *                   dokumen_lampiran: "http://192.168.1.4:9000/notulen/images.jpeg"
 *                   status: "Penting"
 *                   updated_by: "Aralasia"
 *                   created_by: "Aralasia"
 *                   user_id: "82fc65cf-9536-4fa1-8c18-c042f3d5e625"
 *       404:
 *         description: "Notulen tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Notulen with not found"
 *       500:
 *         description: "Kesalahan internal server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.patch('/:id', upload.single('dokumen_lampiran'), authMiddleware, NotulenController.updateNotulen);



/**
 * @swagger
 * /api/notulen/{id}:
 *   delete:
 *     summary: "Menghapus notulen berdasarkan ID"
 *     tags:
 *       - Notulen
 *     description: "Endpoint ini untuk menghapus notulen berdasarkan ID"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID notulen yang akan dihapus"
 *     responses:
 *       200:
 *         description: "Notulen deleted successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Notulen deleted successfully"
 *       404:
 *         description: "Notulen tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Notulen ID not found"
 *       500:
 *         description: "Kesalahan internal server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.delete('/:id', authMiddleware, NotulenController.deleteNotulen);



export default router;
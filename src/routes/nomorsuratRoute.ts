import express from 'express';
import { nomorsuratController } from '../controller/nomorsuratController';
import { authMiddleware } from '../middleware/authMiddleware';


const router = express.Router();
/**
 * @swagger
 * /api/nomor-surat:
 *   get:
 *     summary: "Mengambil semua nomor surat"
 *     tags:
 *       - Nomor Surat
 *     description: "Mengambil daftar semua nomor surat dengan detail yang relevan"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Daftar nomor surat berhasil diambil"
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
 *                           nomor_surat:
 *                             type: string
 *                           keterangan:
 *                             type: string
 *                           deskripsi:
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
 *                   example: "Surat masuk retrieved successfully"
 *             example:
 *               data:
 *                 paginatedData: [
 *                   {
 *                     nomor_surat: "SA/UBL/LAB/7/02/25",
 *                     keterangan: "SA",
 *                     deskripsi: "random"
 *                   },
 *                   {
 *                     nomor_surat: "SA/UBL/LAB/6/02/25",
 *                     keterangan: "SA",
 *                     deskripsi: "kata kita"
 *                   },
 *                   // ... data lainnya
 *                 ]
 *                 meta: {
 *                   currentPage: 1,
 *                   offset: 0,
 *                   itemsPerPage: 10,
 *                   unpaged: false,
 *                   totalPages: 1,
 *                   totalItems: 8,
 *                   sortBy: [],
 *                   filter: {}
 *                 }
 *               status: 200
 *               message: "Surat masuk retrieved successfully"
 *       400:
 *         description: "Bad Request - Invalid input"
 *       500:
 *         description: "Internal Server Error"
 */

router.get('/', authMiddleware,  nomorsuratController.getAllNomorsurat);

/**
 * @swagger
 * /api/nomor-surat:
 *   post:
 *     summary: Membuat nomor surat baru
 *     tags:
 *       - Nomor Surat
 *     description: Membuat entri nomor surat baru dengan detail yang relevan
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               keterangan:
 *                 type: string
 *                 enum:
 *                   - H
 *                   - SA
 *                   - S
 *                   - P
 *                   - SS
 *                 description: Keterangan untuk nomor surat
 *               deskripsi:
 *                 type: string
 *                 description: Deskripsi untuk nomor surat
 *             required:
 *               - keterangan
 *               - deskripsi
 *             example:
 *               keterangan: "H"
 *               deskripsi: "Best"
 *     responses:
 *       200:
 *         description: Nomor surat berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     nomor_surat:
 *                       type: string
 *                     keterangan:
 *                       type: string
 *                     deskripsi:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Nomor surat created successfully"
 *             example: 
 *               status: 200
 *               data: 
 *                 nomor_surat: "H/UBL/LAB/09/02/25"
 *                 keterangan: "H"
 *                 deskripsi: "Best"
 *               message: "Nomor surat created successfully"
 *       400:
 *         description: "Bad Request - Invalid input"
 *       500:
 *         description: "Internal Server Error"
 */

router.post('/', authMiddleware, nomorsuratController.createnomorSurat);

/**
 * @swagger
 * /api/nomor-surat/{id}:
 *   get:
 *     summary: "Mengambil nomor surat berdasarkan ID"
 *     tags:
 *       - Nomor Surat
 *     description: "Mengambil detail nomor surat berdasarkan ID yang diberikan"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID nomor surat"
 *     responses:
 *       200:
 *         description: "Nomor surat berhasil diambil"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     nomor_surat:
 *                       type: string
 *                     keterangan:
 *                       type: string
 *                     deskripsi:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Nomor surat retrieved successfully"
 *             example: 
 *               status: 200
 *               data: 
 *                 nomor_surat: "H/UBL/LAB/08/02/25"
 *                 keterangan: "H"
 *                 deskripsi: "Kerandoman"
 *               message: "Nomor surat retrieved successfully"
 *       404:
 *         description: "Nomor surat tidak ditemukan"
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
 *                   example: "NomorSurat with ID H/UBL/LAB/08/02/25 not found"
 *       500:
 *         description: "Internal Server Error"
 */

router.get('/:id', authMiddleware, nomorsuratController.getNomorSuratById);

/**
 * @swagger
 * /api/nomor-surat/{id}:
 *   patch:
 *     summary: Memperbarui nomor surat berdasarkan ID
 *     tags:
 *       - Nomor Surat
 *     description: Memperbarui entri nomor surat yang ada berdasarkan ID yang diberikan
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID nomor surat"
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               keterangan:
 *                 type: string
 *                 enum:
 *                   - H
 *                   - SA
 *                   - S
 *                   - P
 *                   - SS
 *                 description: Keterangan untuk nomor surat
 *               deskripsi:
 *                 type: string
 *                 description: Deskripsi untuk nomor surat
 *             required:
 *               - keterangan
 *               - deskripsi
 *             example:
 *               keterangan: "H"
 *               deskripsi: "Test"
 *     responses:
 *       200:
 *         description: Nomor surat berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "NomorSurat updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     nomor_surat:
 *                       type: string
 *                     keterangan:
 *                       type: string
 *                     deskripsi:
 *                       type: string
 *             example:
 *               message: "NomorSurat updated successfully"
 *               data: 
 *                 nomor_surat: "H/UBL/LAB/08/02/25"
 *                 keterangan: "H"
 *                 deskripsi: "Test"
 *       400:
 *         description: "Bad Request - Invalid input"
 *       404:
 *         description: "Nomor Surat tidak ditemukan"
 *       500:
 *         description: "Internal Server Error"
 */

router.patch('/:id', authMiddleware, nomorsuratController.updateNomorSurat);

/**
 * @swagger
 * /api/nomor-surat/{id}:
 *   delete:
 *     summary: "Menghapus nomor surat berdasarkan ID"
 *     tags:
 *       - Nomor Surat
 *     description: "Menghapus entri nomor surat yang ada berdasarkan ID yang diberikan"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID nomor surat"
 *     responses:
 *       200:
 *         description: "Nomor surat berhasil dihapus"
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
 *                   example: "NomorSurat deleted successfully"
 *       404:
 *         description: "Nomor surat tidak ditemukan"
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
 *                   example: "NomorSurat with ID H/UBL/LAB/08/02/25 not found"
 *       500:
 *         description: "Internal Server Error"
 */

router.delete('/:id', authMiddleware, nomorsuratController.deleteNomorSurat);

export default router;
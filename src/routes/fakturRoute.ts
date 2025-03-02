import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { FakturController } from '../controller/fakturController';
import { upload } from '../middleware/mutler';


const router = express.Router();

/**
 * @swagger
 * /api/faktur:
 *   get:
 *     summary: "Mendapatkan semua faktur dengan pagination"
 *     tags:
 *       - Faktur
 *     description: "Endpoint ini untuk mendapatkan semua faktur dengan pagination"
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
 *     responses:
 *       200:
 *         description: "Faktur retrieved successfully"
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
 *                           bukti_pembayaran:
 *                             type: string
 *                             example: "http://bucket-production-2f24.up.railway.app:443/faktur/images.jpeg"
 *                           deskripsi:
 *                             type: string
 *                           jumlah_pengeluaran:
 *                             type: number
 *                           metode_pembayaran:
 *                             type: string
 *                           status_pembayaran:
 *                             type: string
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               nama:
 *                                 type: string
 *                               jabatan:
 *                                 type: string
 *                               nomor_identitas:
 *                                 type: string
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
 *                   example: "Faktur retrieved successfully"
 *               example:
 *                 data:
 *                   paginatedData:
 *                     - id: "f3883433-7881-47a2-b102-7d829d36ad58"
 *                       bukti_pembayaran: "http://bucket-production-2f24.up.railway.app:443/faktur/images.jpeg"
 *                       deskripsi: "pengeluaran barang"
 *                       jumlah_pengeluaran: 1000
 *                       metode_pembayaran: "cash"
 *                       status_pembayaran: "lunas"
 *                       user:
 *                         id: "443c97ea-6df0-4850-9e0a-ab6e908d89ac"
 *                         nama: "Arafie"
 *                         jabatan: "presiden kerajaan mueshern"
 *                         nomor_identitas: "2111500340"
 *                   meta:
 *                     currentPage: 1
 *                     offset: 0
 *                     itemsPerPage: 10
 *                     unpaged: false
 *                     totalPages: 1
 *                     totalItems: 1
 *                     sortBy: []
 *                     filter: {}
 *                 status: 200
 *                 message: "Faktur retrieved successfully"
 *       404:
 *         description: "Faktur tidak ditemukan"
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
 *                   example: "Faktur not found"
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
router.get('/', authMiddleware, FakturController.getAllFaktur);



/**
 * @swagger
 * /api/faktur/{id}:
 *   get:
 *     summary: "Mendapatkan faktur berdasarkan ID"
 *     tags:
 *       - Faktur
 *     description: "Endpoint ini untuk mendapatkan faktur berdasarkan ID"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID faktur yang akan diambil"
 *     responses:
 *       200:
 *         description: "Faktur retrieved successfully"
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
 *                     id:
 *                       type: string
 *                     bukti_pembayaran:
 *                       type: string
 *                       example: "http://bucket-production-2f24.up.railway.app:443/faktur/images.jpeg"
 *                     deskripsi:
 *                       type: string
 *                       example: "pengeluaran barang"
 *                     jumlah_pengeluaran:
 *                       type: number
 *                       example: 1000
 *                     metode_pembayaran:
 *                       type: string
 *                       example: "cash"
 *                     status_pembayaran:
 *                       type: string
 *                       example: "lunas"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "443c97ea-6df0-4850-9e0a-ab6e908d89ac"
 *                         nama:
 *                           type: string
 *                           example: "Arafie"
 *                         jabatan:
 *                           type: string
 *                           example: "presiden kerajaan mueshern"
 *                         nomor_identitas:
 *                           type: string
 *                           example: "2111500340"
 *                 message:
 *                   type: string
 *                   example: "Faktur retrieved successfully"
 *               example:
 *                 status: 200
 *                 data:
 *                   id: "f3883433-7881-47a2-b102-7d829d36ad58"
 *                   bukti_pembayaran: "http://bucket-production-2f24.up.railway.app:443/faktur/images.jpeg"
 *                   deskripsi: "pengeluaran barang"
 *                   jumlah_pengeluaran: 1000
 *                   metode_pembayaran: "cash"
 *                   status_pembayaran: "lunas"
 *                   user:
 *                     id: "443c97ea-6df0-4850-9e0a-ab6e908d89ac"
 *                     nama: "Arafie"
 *                     jabatan: "presiden kerajaan mueshern"
 *                     nomor_identitas: "2111500340"
 *                 message: "Faktur retrieved successfully"
 *       404:
 *         description: "Faktur tidak ditemukan"
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
 *                   example: "Faktur with ID {id} not found"
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
router.get('/:id', authMiddleware, FakturController.getFakturById);


/**
 * @swagger
 * /api/faktur:
 *   post:
 *     summary: "Membuat faktur baru"
 *     tags:
 *       - Faktur
 *     description: "Endpoint ini untuk membuat faktur baru"
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bukti_pembayaran:
 *                 type: string
 *                 format: binary
 *                 description: "File bukti pembayaran"
 *               deskripsi:
 *                 type: string
 *                 description: "Deskripsi faktur"
 *               jumlah_pengeluaran:
 *                 type: number
 *                 description: "Jumlah pengeluaran"
 *               metode_pembayaran:
 *                 type: string
 *                 description: "Metode pembayaran"
 *               status_pembayaran:
 *                 type: string
 *                 description: "Status pembayaran"
 *     responses:
 *       201:
 *         description: "Faktur created successfully"
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
 *                     bukti_pembayaran:
 *                       type: string
 *                       example: "http://bucket-production-2f24.up.railway.app:443/faktur/1740903852719-images.jpeg"
 *                     deskripsi:
 *                       type: string
 *                       example: "pengeluaran barang"
 *                     jumlah_pengeluaran:
 *                       type: number
 *                       example: 1000
 *                     metode_pembayaran:
 *                       type: string
 *                       example: "cash"
 *                     status_pembayaran:
 *                       type: string
 *                       example: "lunas"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nama:
 *                           type: string
 *                         jabatan:
 *                           type: string
 *                         nomor_identitas:
 *                           type: string
 *                 message:
 *                   type: string
 *                   example: "Faktur created successfully"
 *               example:
 *                 status: 201
 *                 data:
 *                   id: "4a6d7d64-3722-4923-8a9c-1c64b1c69f6e"
 *                   bukti_pembayaran: "http://bucket-production-2f24.up.railway.app:443/faktur/1740903852719-images.jpeg"
 *                   deskripsi: "pengeluaran barang"
 *                   jumlah_pengeluaran: 1000
 *                   metode_pembayaran: "cash"
 *                   status_pembayaran: "lunas"
 *                   user:
 *                     id: "443c97ea-6df0-4850-9e0a-ab6e908d89ac"
 *                     nama: "Arafie"
 *                     jabatan: "presiden kerajaan mueshern"
 *                     nomor_identitas: "2111500340"
 *                 message: "Faktur created successfully"
 *       400:
 *         description: "Kesalahan input data"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Kesalahan input data"
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
router.post('/', upload.single('bukti_pembayaran'), authMiddleware, FakturController.createFaktur);



/**
 * @swagger
 * /api/faktur/{id}:
 *   patch:
 *     summary: "Memperbarui faktur berdasarkan ID"
 *     tags:
 *       - Faktur
 *     description: "Endpoint ini untuk memperbarui faktur berdasarkan ID"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID faktur yang akan diperbarui"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bukti_pembayaran:
 *                 type: string
 *                 format: binary
 *                 description: "File bukti pembayaran"
 *               deskripsi:
 *                 type: string
 *                 description: "Deskripsi faktur"
 *               jumlah_pengeluaran:
 *                 type: number
 *                 description: "Jumlah pengeluaran"
 *               metode_pembayaran:
 *                 type: string
 *                 description: "Metode pembayaran"
 *               status_pembayaran:
 *                 type: string
 *                 description: "Status pembayaran"
 *     responses:
 *       200:
 *         description: "Faktur updated successfully"
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
 *                     id:
 *                       type: string
 *                     bukti_pembayaran:
 *                       type: string
 *                       example: "http://bucket-production-2f24.up.railway.app:443/faktur/1739205465983-images.jpeg"
 *                     deskripsi:
 *                       type: string
 *                       example: "test"
 *                     jumlah_pengeluaran:
 *                       type: number
 *                       example: 1000
 *                     metode_pembayaran:
 *                       type: string
 *                       example: "cash"
 *                     status_pembayaran:
 *                       type: string
 *                       example: "lunas"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nama:
 *                           type: string
 *                         jabatan:
 *                           type: string
 *                         nomor_identitas:
 *                           type: string
 *                 message:
 *                   type: string
 *                   example: "Faktur updated successfully"
 *               example:
 *                 status: 200
 *                 data:
 *                   id: "6f9026b0-8ba6-44ed-a725-688921111b87"
 *                   bukti_pembayaran: "http://bucket-production-2f24.up.railway.app:443/faktur/1739205465983-images.jpeg"
 *                   deskripsi: "test"
 *                   jumlah_pengeluaran: 1000
 *                   metode_pembayaran: "cash"
 *                   status_pembayaran: "lunas"
 *                   user:
 *                     id: "443c97ea-6df0-4850-9e0a-ab6e908d89ac"
 *                     nama: "Arafie"
 *                     jabatan: "presiden kerajaan mueshern"
 *                     nomor_identitas: "2111500340"
 *                 message: "Faktur updated successfully"
 *       404:
 *         description: "Faktur tidak ditemukan"
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
 *                   example: "Faktur with ID {id} not found"
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
router.patch('/:id', upload.single('bukti_pembayaran'), authMiddleware, FakturController.updateFaktur);



/**
 * @swagger
 * /api/faktur/{id}:
 *   delete:
 *     summary: "Menghapus faktur berdasarkan ID"
 *     tags:
 *       - Faktur
 *     description: "Endpoint ini untuk menghapus faktur berdasarkan ID"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID faktur yang akan dihapus"
 *     responses:
 *       200:
 *         description: "Faktur deleted successfully"
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
 *                   example: "Faktur deleted successfully"
 *       404:
 *         description: "Faktur tidak ditemukan"
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
 *                   example: "Faktur with ID {id} not found"
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
router.delete('/:id', authMiddleware, FakturController.deleteFaktur);


export default router;
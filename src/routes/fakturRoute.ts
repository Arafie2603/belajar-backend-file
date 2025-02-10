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
 *                             example: "http://192.168.1.4:9000/faktur/1739204905531-images.jpeg"
 *                           deskripsi:
 *                             type: string
 *                             example: "Test123"
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
 *                     - id: "ac21ac01-bccd-46c1-88ff-02328df09adc"
 *                       bukti_pembayaran: "http://192.168.1.4:9000/faktur/1739204905531-images.jpeg"
 *                       deskripsi: "Test123"
 *                     - id: "ee19d83f-9669-4c5c-8495-246c233ba02a"
 *                       bukti_pembayaran: "http://192.168.1.4:9000/faktur/1739204006457-images.jpeg"
 *                       deskripsi: "Testing"
 *                   meta:
 *                     currentPage: 1
 *                     offset: 0
 *                     itemsPerPage: 10
 *                     unpaged: false
 *                     totalPages: 1
 *                     totalItems: 2
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
 *                       example: "http://192.168.1.4:9000/faktur/1739204905531-images.jpeg"
 *                     deskripsi:
 *                       type: string
 *                       example: "Test123"
 *                 message:
 *                   type: string
 *                   example: "Faktur retrieved successfully"
 *               example:
 *                 status: 200
 *                 data:
 *                   id: "ac21ac01-bccd-46c1-88ff-02328df09adc"
 *                   bukti_pembayaran: "http://192.168.1.4:9000/faktur/1739204905531-images.jpeg"
 *                   deskripsi: "Test123"
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
 *                       example: "http://192.168.1.4:9000/faktur/1739205205498-images.jpeg"
 *                     deskripsi:
 *                       type: string
 *                       example: "Test123"
 *                 message:
 *                   type: string
 *                   example: "Faktur created successfully"
 *               example:
 *                 status: 201
 *                 data:
 *                   id: "24cd3d35-02f1-43be-ae41-6d718fe019d7"
 *                   bukti_pembayaran: "http://192.168.1.4:9000/faktur/1739205205498-images.jpeg"
 *                   deskripsi: "Test123"
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
 *                       example: "http://192.168.1.4:9000/faktur/1739205465983-images.jpeg"
 *                     deskripsi:
 *                       type: string
 *                       example: "test"
 *                 message:
 *                   type: string
 *                   example: "Faktur updated successfully"
 *               example:
 *                 status: 200
 *                 data:
 *                   id: "6f9026b0-8ba6-44ed-a725-688921111b87"
 *                   bukti_pembayaran: "http://192.168.1.4:9000/faktur/1739205465983-images.jpeg"
 *                   deskripsi: "test"
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
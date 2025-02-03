import express from 'express';
import { suratmasukController } from '../controller/suratmasukController';
import { upload } from '../middleware/mutler'; 
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/surat:
 *   get:
 *     summary: "Mengambil daftar surat masuk"
 *     tags:
 *       - Surat Masuk
 *     description: "Mengambil daftar surat masuk dengan fitur pagination dan filter berdasarkan tujuan dan kategori."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: "Nomor halaman yang ingin diambil"
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: totalData
 *         in: query
 *         description: "Jumlah data per halaman"
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: tujuan
 *         in: query
 *         description: "Filter untuk mencari berdasarkan tujuan"
 *         required: false
 *         schema:
 *           type: string
 *       - name: kategori
 *         in: query
 *         description: "Filter untuk mencari berdasarkan kategori"
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Daftar surat masuk berhasil diambil"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       no_surat_masuk:
 *                         type: string
 *                       tanggal:
 *                         type: string
 *                         format: date-time
 *                       alamat:
 *                         type: string
 *                       perihal:
 *                         type: string
 *                       tujuan:
 *                         type: string
 *                       organisasi:
 *                         type: string
 *                       pengirim:
 *                         type: string
 *                       penerima:
 *                         type: string
 *                       sifat_surat:
 *                         type: string
 *                       scan_surat:
 *                         type: string
 *                       expired_data:
 *                         type: string
 *                         format: date-time
 *                       user_id:
 *                         type: string
 *                       tanggal_penyelesaian:
 *                         type: string
 *                         format: date-time
 *                       isi_disposisi:
 *                         type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 *                     unpaged:
 *                       type: boolean
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     sortBy:
 *                       type: array
 *                       items:
 *                         type: string
 *                     filter:
 *                       type: object
 *               example:
 *                 data: 
 *                   - no_surat_masuk: "12345"
 *                     tanggal: "2025-02-01T00:00:00.000Z"
 *                     alamat: "Jl. Merdeka No. 1"
 *                     perihal: "Pengajuan Proposal"
 *                     tujuan: "PT Contoh"
 *                     organisasi: "Dinas Pendidikan"
 *                     pengirim: "Bapak A"
 *                     penerima: "Ibu B"
 *                     sifat_surat: "Penting"
 *                     scan_surat: "http://example.com/scan1.jpg"
 *                     expired_data: "2025-03-01T00:00:00.000Z"
 *                     user_id: "user123"
 *                     tanggal_penyelesaian: "2025-02-10"
 *                     isi_disposisi: "Segera ditindaklanjuti"
 *                 meta: 
 *                   currentPage: 1
 *                   offset: 0
 *                   itemsPerPage: 10
 *                   unpaged: false
 *                   totalPages: 1
 *                   totalItems: 1
 *                   sortBy: []
 *                   filter: {}
 *       400:
 *         description: "Bad Request - Invalid input"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 400
 *               message: "Invalid input"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 */

router.get('/', suratmasukController.getAllSuratmasuk);

/**
 * @swagger
 * /api/surat/{id}:
 *   get:
 *     summary: "Mengambil detail surat masuk berdasarkan ID"
 *     tags:
 *       - Surat Masuk
 *     description: "Mengambil detail surat masuk berdasarkan ID yang diberikan."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID surat masuk yang ingin diambil"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Detail surat masuk berhasil diambil"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     no_surat_masuk:
 *                       type: string
 *                     tanggal:
 *                       type: string
 *                       format: date-time
 *                     alamat:
 *                       type: string
 *                     perihal:
 *                       type: string
 *                     tujuan:
 *                       type: string
 *                     organisasi:
 *                       type: string
 *                     pengirim:
 *                       type: string
 *                     penerima:
 *                       type: string
 *                     sifat_surat:
 *                       type: string
 *                     scan_surat:
 *                       type: string
 *                     expired_data:
 *                       type: string
 *                       format: date-time
 *                     user_id:
 *                       type: string
 *                     tanggal_penyelesaian:
 *                       type: string
 *                       format: date-time
 *                     isi_disposisi:
 *                       type: string
 *                 message:
 *                   type: string
 *               example:
 *                 status: 200
 *                 data:
 *                   no_surat_masuk: "3bbd86a8-a58f-428d-8c00-0a545dff64d9"
 *                   tanggal: "2025-02-10T00:00:00.000Z"
 *                   alamat: "Jl. Cendrawasih"
 *                   perihal: "Sharingla Frontier"
 *                   tujuan: "Achen"
 *                   organisasi: "Lab ICT"
 *                   pengirim: "Bapak A"
 *                   penerima: "Ibu B"
 *                   sifat_surat: "penting"
 *                   scan_surat: "http://localhost:9000/suratmasuk/1738578257317-Aotearoa.jpg"
 *                   expired_data: "2025-10-02T00:00:00.000Z"
 *                   user_id: "b659245d-f148-419f-b44a-374b3234e815"
 *                   tanggal_penyelesaian: "2025-07-12"
 *                   isi_disposisi: "Tindak lanjut"
 *                 message: "Surat masuk retrieved successfully"
 *       400:
 *         description: "Bad Request - Invalid ID format"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 400
 *               message: "Invalid ID format"
 *       404:
 *         description: "Not Found - Surat masuk tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 404
 *               message: "Surat masuk not found"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 */

router.get('/:no_surat_masuk', suratmasukController.getSuratmasukById);

/**
 * @swagger
 * /api/surat:
 *   post:
 *     summary: "Membuat surat masuk baru"
 *     tags:
 *       - Surat Masuk
 *     description: "Creates a new incoming mail entry with all the relevant details."
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tanggal:
 *                 type: string
 *                 format: date
 *               alamat:
 *                 type: string
 *               perihal:
 *                 type: string
 *               tujuan:
 *                 type: string
 *               organisasi:
 *                 type: string
 *               pengirim:
 *                 type: string
 *               penerima:
 *                 type: string
 *               sifat_surat:
 *                 type: string
 *               scan_surat:
 *                 type: string
 *                 format: binary
 *               expired_data:
 *                 type: string
 *                 format: date
 *               diteruskan_kepada:
 *                 type: string
 *               kategori: 
 *                 type: string
 *               tanggal_penyelesaian:
 *                 type: string
 *               isi_disposisi:
 *                 type: string
 *             example: 
 *               tanggal: "2025-02-03"
 *               alamat: "Jl. Merdeka No. 1"
 *               perihal: "Pengajuan Proposal"
 *               tujuan: "PT Contoh"
 *               organisasi: "Dinas Pendidikan"
 *               pengirim: "Bapak A"
 *               penerima: "Ibu B"
 *               sifat_surat: "Penting"
 *               expired_data: "2025-03-03"
 *               diteruskan_kepada: "Bagian Keuangan"
 *               tanggal_penyelesaian: "2025-02-10"
 *               isi_disposisi: "Segera ditindaklanjuti"
 *     responses:
 *       201:
 *         description: "Surat masuk berhasil dibuat"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     no_surat_masuk:
 *                       type: string
 *                     tanggal:
 *                       type: string
 *                     alamat:
 *                       type: string
 *                     perihal:
 *                       type: string
 *                     tujuan:
 *                       type: string
 *                     organisasi:
 *                       type: string
 *                     pengirim:
 *                       type: string
 *                     penerima:
 *                       type: string
 *                     sifat_surat:
 *                       type: string
 *                     scan_surat:
 *                       type: string
 *                     expired_data:
 *                       type: string
 *                     diteruskan_kepada:
 *                       type: string
 *                     tanggal_penyelesaian:
 *                       type: string
 *                     isi_disposisi:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example: {
 *                 "data": {
 *                   "no_surat_masuk": "3bbd86a8-a58f-428d-8c00-0a545dff64d9",
 *                   "tanggal": "2025-02-10T00:00:00.000Z",
 *                   "alamat": "Jl. Cendrawasih",
 *                   "perihal": "Sharingla Frontier",
 *                   "tujuan": "Achen",
 *                   "kategori": "Perbaikan",
 *                   "organisasi": "Lab ICT",
 *                   "pengirim": "Bapak A",
 *                   "penerima": "Ibu B",
 *                   "sifat_surat": "penting",
 *                   "scan_surat": "http://localhost:9000/suratmasuk/1738578257317-Aotearoa.jpg",
 *                   "expired_data": "2025-10-02T00:00:00.000Z",
 *                   "diteruskan_kepada": "Bagian Money",
 *                   "tanggal_penyelesaian": "2025-07-12",
 *                   "isi_disposisi": "Tindak lanjut",
 *                   "user_id": "b659245d-f148-419f-b44a-374b3234e815"
 *                 },
 *                 "status": 201,
 *                 "message": "Surat Masuk created successfully"
 *               }
 *       400:
 *         description: "Bad Request - Invalid input"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: string
 *             example: {
 *               "status": 400,
 *               "message": "File is required",
 *               "errors": "No file uploaded"
 *             }
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example: {
 *               "status": 500,
 *               "message": "Internal Server Error"
 *             }
 */

router.post('/', upload.single('scan_surat'), authMiddleware ,suratmasukController.createSuratmasuk);

/**
 * @swagger
 * /api/surat/{id}:
 *   patch:
 *     summary: "Memperbarui surat masuk berdasarkan ID"
 *     tags:
 *       - Surat Masuk
 *     description: "Memperbarui surat masuk berdasarkan ID yang diberikan."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID surat masuk yang ingin diperbarui"
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tanggal:
 *                 type: string
 *                 format: date
 *               alamat:
 *                 type: string
 *               perihal:
 *                 type: string
 *               tujuan:
 *                 type: string
 *               organisasi:
 *                 type: string
 *               pengirim:
 *                 type: string
 *               penerima:
 *                 type: string
 *               sifat_surat:
 *                 type: string
 *               scan_surat:
 *                 type: string
 *                 format: binary
 *               expired_data:
 *                 type: string
 *                 format: date
 *               diteruskan_kepada:
 *                 type: string
 *               kategori:
 *                 type: string
 *               tanggal_penyelesaian:
 *                 type: string
 *                 format: date
 *               isi_disposisi:
 *                 type: string
 *             example:
 *               tanggal: "2025-02-10"
 *               alamat: "Jl. Cendrawasih"
 *               perihal: "Sharingla Frontier"
 *               tujuan: "Achen"
 *               organisasi: "Lab ICT"
 *               pengirim: "Bapak A"
 *               penerima: "Ibu B"
 *               sifat_surat: "penting"
 *               expired_data: "2025-10-02"
 *               diteruskan_kepada: "Bagian Money"
 *               kategori: "Perbaikan"
 *               tanggal_penyelesaian: "2025-07-12"
 *               isi_disposisi: "Tindak lanjut"
 *     responses:
 *       200:
 *         description: "Surat masuk berhasil diperbarui"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     no_surat_masuk:
 *                       type: string
 *                     tanggal:
 *                       type: string
 *                       format: date-time
 *                     alamat:
 *                       type: string
 *                     perihal:
 *                       type: string
 *                     tujuan:
 *                       type: string
 *                     kategori:
 *                       type: string
 *                     organisasi:
 *                       type: string
 *                     pengirim:
 *                       type: string
 *                     penerima:
 *                       type: string
 *                     sifat_surat:
 *                       type: string
 *                     scan_surat:
 *                       type: string
 *                     expired_data:
 *                       type: string
 *                       format: date-time
 *                     diteruskan_kepada:
 *                       type: string
 *                     tanggal_penyelesaian:
 *                       type: string
 *                       format: date-time
 *                     isi_disposisi:
 *                       type: string
 *                     user_id:
 *                       type: string
 *               example:
 *                 status: "success"
 *                 data:
 *                   no_surat_masuk: "3bbd86a8-a58f-428d-8c00-0a545dff64d9"
 *                   tanggal: "2025-02-10T00:00:00.000Z"
 *                   alamat: "Jl. Cendrawasih"
 *                   perihal: "Sharingla Frontier"
 *                   tujuan: "Achen"
 *                   kategori: "Perbaikan"
 *                   organisasi: "Lab ICT"
 *                   pengirim: "Bapak A"
 *                   penerima: "Ibu B"
 *                   sifat_surat: "penting"
 *                   scan_surat: "http://localhost:9000/suratmasuk/1738585369421-Aotearoa.jpg"
 *                   expired_data: "2025-10-02T00:00:00.000Z"
 *                   diteruskan_kepada: "Bagian Money"
 *                   tanggal_penyelesaian: "2025-07-12"
 *                   isi_disposisi: "Tindak lanjut"
 *                   user_id: "b659245d-f148-419f-b44a-374b3234e815"
 *       404:
 *         description: "Surat masuk tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               status: "error"
 *               message: "Surat masuk with ID 3bbd86a8-a58f-428d-8c00-0a545dff64d9ss not found"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               status: "error"
 *               message: "Internal Server Error"
 */



router.patch('/:no_surat_masuk', upload.single('scan_surat'), authMiddleware, suratmasukController.updateSuratmasuk);

/**
 * @swagger
 * /api/surat/{no_surat_masuk}:
 *   delete:
 *     summary: "Menghapus surat masuk berdasarkan ID"
 *     tags:
 *       - Surat Masuk
 *     description: "Menghapus surat masuk berdasarkan ID yang diberikan."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: no_surat_masuk
 *         in: path
 *         description: "ID surat masuk yang ingin dihapus"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Surat masuk berhasil dihapus"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 200
 *                 message: "Suratmasuk deleted successfully"
 *       404:
 *         description: "Surat masuk tidak ditemukan"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               message: "Surat masuk with ID 53493c68-adc2-49c0-afcf-ff8091e115d3s not found"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 */

router.delete('/:no_surat_masuk', authMiddleware, suratmasukController.deleteSuratmasuk);

export default router;

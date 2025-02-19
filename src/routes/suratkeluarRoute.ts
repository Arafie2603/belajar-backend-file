import express from 'express';
import { suratkeluarController } from '../controller/suratkeluarController';
import { upload } from '../middleware/mutler'; 
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/surat-keluar:
 *   get:
 *     summary: "Mengambil daftar surat keluar"
 *     tags:
 *       - Surat Keluar
 *     description: "Mengambil daftar surat keluar dengan fitur pagination dan filter"
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
 *       - name: sifat_surat
 *         in: query
 *         description: "Filter untuk mencari berdasarkan sifat surat"
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Daftar surat keluar berhasil diambil"
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
 *                       id:
 *                         type: string
 *                       tanggal:
 *                         type: string
 *                         format: date-time
 *                       tempat_surat:
 *                         type: string
 *                       lampiran:
 *                         type: string
 *                       isi_surat:
 *                         type: string
 *                       penerima:
 *                         type: string
 *                       pengirim:
 *                         type: string
 *                       jabatan_pengirim:
 *                         type: string
 *                       gambar:
 *                         type: string
 *                       keterangan_gambar:
 *                         type: string
 *                       sifat_surat:
 *                         type: string
 *                       user_id:
 *                         type: string
 *                       surat_nomor:
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
 *                     filter:
 *                       type: object
 *       400:
 *         description: "Bad Request - Invalid input"
 *       500:
 *         description: "Internal Server Error"
 *
 */

router.get('/', authMiddleware, suratkeluarController.getAllSuratkeluar);


/**
 * @swagger
 * /api/surat-keluar/{id}:
 *   get:
 *     summary: "Mengambil surat keluar berdasarkan ID"
 *     tags:
 *       - Surat Keluar
 *     description: "Mengambil detail surat keluar berdasarkan ID yang diberikan"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID surat keluar"
 *     responses:
 *       200:
 *         description: "Surat keluar berhasil diambil"
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
 *                     tanggal:
 *                       type: string
 *                       format: date-time
 *                     tempat_surat:
 *                       type: string
 *                     lampiran:
 *                       type: string
 *                     isi_surat:
 *                       type: string
 *                     penerima:
 *                       type: string
 *                     pengirim:
 *                       type: string
 *                     jabatan_pengirim:
 *                       type: string
 *                     gambar:
 *                       type: string
 *                     keterangan_gambar:
 *                       type: string
 *                     sifat_surat:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     surat_nomor:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Surat masuk retrieved successfully"
 *             example:
 *               status: 200
 *               data: 
 *                 id: "000a60a2-6cf7-42f4-9328-ff1b6a551183"
 *                 tanggal: "2025-01-10T00:00:00.000Z"
 *                 tempat_surat: "Jakarta"
 *                 lampiran: "Lampir"
 *                 isi_surat: "Isian"
 *                 penerima: "Ara"
 *                 pengirim: "Aralasia"
 *                 jabatan_pengirim: "Programmer"
 *                 gambar: "http://192.168.1.18:9000/suratkeluar/images.jpeg"
 *                 keterangan_gambar: "Ini gambar"
 *                 sifat_surat: "Sangat Penting"
 *                 user_id: "510ff921-b6ca-4b6d-b916-a69dad29df99"
 *                 surat_nomor: "SA/UBL/LAB/4/02/25"
 *               message: "Surat masuk retrieved successfully"
 *       404:
 *         description: "Surat masuk tidak ditemukan"
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
 *                   example: "Surat masuk not found"
 *       500:
 *         description: "Internal Server Error"
 */

router.get('/:id', authMiddleware, suratkeluarController.getSuratmasukById);
/**
 * @swagger
 * /api/surat-keluar:
 *   post:
 *     summary: Membuat surat keluar baru
 *     tags:
 *       - Surat Keluar
 *     description: Membuat entri surat keluar baru dengan semua detail yang relevan
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
 *               tempat_surat:
 *                 type: string
 *               lampiran:
 *                 type: string
 *               isi_surat:
 *                 type: string
 *               penerima:
 *                 type: string
 *               pengirim:
 *                 type: string
 *               jabatan_pengirim:
 *                 type: string
 *               gambar:
 *                 type: string
 *                 format: binary
 *               keterangan_gambar:
 *                 type: string
 *               sifat_surat:
 *                 type: string
 *               keterangan:
 *                 type: string
 *                 enum:
 *                   - H
 *                   - SA
 *                   - S
 *                   - P
 *                   - SS
 *               deskripsi:
 *                 type: string
 *               kategori:
 *                 type: string
 *             example:
 *               tanggal: "2025-02-03"
 *               tempat_surat: "Kantor Utama"
 *               lampiran: "Proposal Kegiatan"
 *               isi_surat: "Surat permohonan kerjasama"
 *               penerima: "PT Maju Sejahtera"
 *               pengirim: "Bapak Administrator"
 *               jabatan_pengirim: "Kepala Divisi"
 *               sifat_surat: "Penting"
 *               keterangan: "H"
 *     responses:
 *       201:
 *         description: Surat keluar berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     tanggal:
 *                       type: string
 *                       format: date-time
 *                     tempat_surat:
 *                       type: string
 *                     lampiran:
 *                       type: string
 *                     isi_surat:
 *                       type: string
 *                     penerima:
 *                       type: string
 *                     pengirim:
 *                       type: string
 *                     jabatan_pengirim:
 *                       type: string
 *                     gambar:
 *                       type: string
 *                     keterangan_gambar:
 *                       type: string
 *                     sifat_surat:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     surat_nomor:
 *                       type: string
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Surat keluar created successfully
 *             example:
 *               data: 
 *                 id: "6894062e-e8fd-4243-a571-75906c55987a"
 *                 tanggal: "2025-01-10T00:00:00.000Z"
 *                 tempat_surat: "jakarta"
 *                 lampiran: "yaya"
 *                 isi_surat: "isi"
 *                 penerima: "Ara"
 *                 pengirim: "juga ara"
 *                 jabatan_pengirim: "arajuga"
 *                 gambar: "http://192.168.1.18:9000/suratkeluar/images.jpeg"
 *                 keterangan_gambar: "motivasi ni wik"
 *                 sifat_surat: "penting aja"
 *                 user_id: "510ff921-b6ca-4b6d-b916-a69dad29df99"
 *                 surat_nomor: "SA/UBL/LAB/6/02/25"
 *               status: 201
 *               message: Surat keluar created successfully
 *       400:
 *         description: Bad Request - Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/', upload.single('gambar'), authMiddleware, suratkeluarController.CreateSuratKeluar);



/**
 * @swagger
 * /api/surat-keluar/{id}:
 *   patch:
 *     summary: "Memperbarui surat keluar berdasarkan ID"
 *     tags:
 *       - Surat Keluar
 *     description: "Memperbarui entri surat keluar yang ada berdasarkan ID yang diberikan"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID surat keluar"
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
 *               tempat_surat:
 *                 type: string
 *               lampiran:
 *                 type: string
 *               isi_surat:
 *                 type: string
 *               penerima:
 *                 type: string
 *               pengirim:
 *                 type: string
 *               jabatan_pengirim:
 *                 type: string
 *               gambar:
 *                 type: string
 *                 format: binary
 *               keterangan_gambar:
 *                 type: string
 *               sifat_surat:
 *                 type: string
 *               keterangan:
 *                 type: string
 *                 enum: [H, SA, S, P, SS]
 *               deskripsi:
 *                 type: string
 *               kategori:
 *                 type: string
 *             example:
 *               tanggal: "2025-02-03"
 *               tempat_surat: "Kantor Utama"
 *               lampiran: "Proposal Kegiatan"
 *               isi_surat: "Surat permohonan kerjasama"
 *               penerima: "PT Maju Sejahtera"
 *               pengirim: "Bapak Administrator"
 *               jabatan_pengirim: "Kepala Divisi"
 *               sifat_surat: "Penting"
 *               keterangan: "H"
 *     responses:
 *       200:
 *         description: "Surat keluar berhasil diperbarui"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Surat Keluar updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     tanggal:
 *                       type: string
 *                       format: date-time
 *                     tempat_surat:
 *                       type: string
 *                     lampiran:
 *                       type: string
 *                     isi_surat:
 *                       type: string
 *                     penerima:
 *                       type: string
 *                     pengirim:
 *                       type: string
 *                     jabatan_pengirim:
 *                       type: string
 *                     gambar:
 *                       type: string
 *                     keterangan_gambar:
 *                       type: string
 *                     sifat_surat:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     surat_nomor:
 *                       type: string
 *             example: 
 *               message: "Surat Keluar updated successfully"
 *               data: 
 *                 id: "000a60a2-6cf7-42f4-9328-ff1b6a551183"
 *                 tanggal: "2025-01-10T00:00:00.000Z"
 *                 tempat_surat: "Jakarta"
 *                 lampiran: "Lampir"
 *                 isi_surat: "Isian"
 *                 penerima: "Ara"
 *                 pengirim: "Aralasia"
 *                 jabatan_pengirim: "Programmer"
 *                 gambar: "http://192.168.1.18:9000/suratkeluar/images.jpeg"
 *                 keterangan_gambar: "Ini gambar"
 *                 sifat_surat: "Sangat Penting"
 *                 user_id: "510ff921-b6ca-4b6d-b916-a69dad29df99"
 *                 surat_nomor: "SA/UBL/LAB/4/02/25"
 *       400:
 *         description: "Bad Request - Invalid input"
 *       404:
 *         description: "Surat Keluar with ID {id} not found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Surat Keluar with ID 000a60a2-6cf7-42f4-9328-ff1b6a55118 not found"
 *       500:
 *         description: "Internal Server Error"
 */
router.patch('/:id', upload.single('gambar'), authMiddleware, suratkeluarController.updateSuratKeluar);
``


/**
 * @swagger
 * /api/surat-keluar/{id}:
 *   delete:
 *     summary: "Menghapus surat keluar berdasarkan ID"
 *     tags:
 *       - Surat Keluar
 *     description: "Menghapus entri surat keluar yang ada berdasarkan ID yang diberikan"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID surat keluar"
 *     responses:
 *       200:
 *         description: "Surat keluar berhasil dihapus"
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
 *                   example: "Surat keluar deleted successfully"
 *       404:
 *         description: "Surat keluar tidak ditemukan"
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
 *                   example: "Surat masuk with ID 6894062e-e8fd-4243-a571-75906c55987a not found"
 *       500:
 *         description: "Internal Server Error"
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
 *                   example: "Internal Server Error"
 */
router.delete('/:id', authMiddleware, suratkeluarController.deleteSuratkeluar);



export default router;

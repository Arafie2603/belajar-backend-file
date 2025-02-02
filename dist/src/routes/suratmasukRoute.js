"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const suratmasukController_1 = require("../controller/suratmasukController");
const mutler_1 = require("../middleware/mutler");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     SuratMasuk:
 *       type: object
 *       required:
 *         - no_surat_masuk
 *         - tanggal
 *         - alamat
 *         - perihal
 *         - tujuan
 *         - organisasi
 *         - pengirim
 *         - penerima
 *         - sifat_surat
 *         - scan_surat
 *         - expired_data
 *       properties:
 *         no_surat_masuk:
 *           type: string
 *           description: Nomor surat masuk
 *         tanggal:
 *           type: string
 *           format: date
 *           description: Tanggal surat
 *         alamat:
 *           type: string
 *           description: Alamat pengirim
 *         perihal:
 *           type: string
 *           description: Perihal surat
 *         tujuan:
 *           type: string
 *           description: Tujuan surat
 *         organisasi:
 *           type: string
 *           description: Nama organisasi
 *         pengirim:
 *           type: string
 *           description: Nama pengirim
 *         penerima:
 *           type: string
 *           description: Nama penerima
 *         sifat_surat:
 *           type: string
 *           description: Sifat surat
 *         scan_surat:
 *           type: string
 *           description: URL file scan surat
 *         expired_data:
 *           type: string
 *           format: date
 *           description: Tanggal kadaluarsa
 *         diteruskan_kepada:
 *           type: string
 *           description: Diteruskan kepada
 *         tanggal_penyelesaian:
 *           type: string
 *           description: Tanggal penyelesaian
 *         isi_disposisi:
 *           type: string
 *           description: Isi disposisi
 */
/**
 * @swagger
 * /api/surat:
 *   post:
 *     summary: Membuat surat masuk baru
 *     tags: [Surat Masuk]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               no_surat_masuk:
 *                 type: string
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
 *               tanggal_penyelesaian:
 *                 type: string
 *               isi_disposisi:
 *                 type: string
 *     responses:
 *       201:
 *         description: Surat masuk berhasil dibuat
 */
/**
 * @swagger
 * /api/surat/{no_surat_masuk}:
 *   patch:
 *     summary: Update surat masuk
 *     tags: [Surat Masuk]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: no_surat_masuk
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SuratMasuk'
 *     responses:
 *       200:
 *         description: Surat masuk berhasil diupdate
 */
/**
 * @swagger
 * /api/surat/{no_surat_masuk}:
 *   delete:
 *     summary: Hapus surat masuk
 *     tags: [Surat Masuk]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: no_surat_masuk
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Surat masuk berhasil dihapus
 */
router.post('/', mutler_1.upload.single('scan_surat'), authMiddleware_1.authMiddleware, suratmasukController_1.suratmasukController.createSuratmasuk);
router.patch('/:no_surat_masuk', mutler_1.upload.single('scan_surat'), authMiddleware_1.authMiddleware, suratmasukController_1.suratmasukController.updateSuratmasuk);
router.delete('/:no_surat_masuk', authMiddleware_1.authMiddleware, suratmasukController_1.suratmasukController.deleteSuratmasuk);
exports.default = router;

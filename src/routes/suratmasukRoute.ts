import express from 'express';
import { suratmasukController } from '../controller/suratmasukController';
import { upload } from '../middleware/mutler'; // Path ke konfigurasi multer Anda
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', upload.single('scan_surat'), authMiddleware ,suratmasukController.createSuratmasuk);
export default router;

import express from 'express';
import { suratkeluarController } from '../controller/suratkeluarController';
import { upload } from '../middleware/mutler'; 
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();


router.post('/',  upload.single('gambar'), authMiddleware, suratkeluarController.CreateSuratKeluar);

export default router;

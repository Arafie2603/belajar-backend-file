

import express from 'express';
import { NotulenController } from '../controller/notulenController';
import { authMiddleware } from '../middleware/authMiddleware';


const router = express.Router();

router.post('/', authMiddleware, NotulenController.createNotulen);


export default router;
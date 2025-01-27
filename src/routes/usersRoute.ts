import express from 'express';
import { usersController } from '../controller/userController';


const router = express.Router();

router.post('/login', usersController.login);
router.post('/register', usersController.register);
export default router;
import express from 'express';
import { usersController } from '../controller/userController';


const router = express.Router();

router.post('/login', usersController.login);
router.post('/register', usersController.register);
router.get('/', usersController.getAllUsers);
router.patch('/', usersController.updateUser);
router.delete('/', usersController.deleteUser);

export default router;
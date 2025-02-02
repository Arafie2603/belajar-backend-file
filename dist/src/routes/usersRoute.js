"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.post('/login', userController_1.usersController.login);
router.post('/register', userController_1.usersController.register);
router.get('/', userController_1.usersController.getAllUsers);
router.patch('/', userController_1.usersController.updateUser);
router.delete('/', userController_1.usersController.deleteUser);
exports.default = router;

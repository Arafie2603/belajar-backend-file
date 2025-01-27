"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const userService_1 = require("../services/userService");
class usersController {
    static getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const totalData = parseInt(req.query.totalData) || 10;
                const response = yield userService_1.userService.getAllUsers(page, totalData);
                res.status(200).json({
                    data: {
                        paginatedData: response.data,
                        meta: response.meta,
                    },
                    status: 200,
                    message: 'Users retrieved successfully',
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    errors: error.message,
                });
            }
        });
    }
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const response = yield userService_1.userService.register(request);
                res.status(201).json({
                    data: response,
                    status: 201,
                    message: 'User created successfully'
                });
            }
            catch (error) {
                if (error.status === 400) {
                    res.status(400).json({
                        status: 400,
                        message: error.message,
                    });
                }
                else {
                    res.status(500).json({
                        status: 500,
                        message: 'Internal Server Error',
                        errors: error.message || null,
                    });
                }
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const user = yield userService_1.userService.login(request); // Perbaikan di sini
                res.status(200).json({
                    data: user, // Sesuaikan respons di sini
                    status: 200,
                    message: 'Successfully logged in'
                });
            }
            catch (error) {
                if (error.status === 401) {
                    res.status(401).json({
                        status: 401,
                        message: error.message,
                    });
                }
                else {
                    res.status(500).json({
                        status: 500,
                        message: 'Internal Server Error',
                        errors: error.message || null,
                    });
                }
            }
        });
    }
}
exports.usersController = usersController;

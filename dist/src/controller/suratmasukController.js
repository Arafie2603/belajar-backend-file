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
exports.suratmasukController = void 0;
const suratmasukService_1 = require("../services/suratmasukService");
class suratmasukController {
    static createSuratmasuk(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        status: 401,
                        message: 'User not authenticated',
                    });
                    return;
                }
                console.log('Authenticate user: ', req.user);
                if (!req.file) {
                    res.status(400).json({
                        status: 400,
                        message: 'File is required',
                        errors: 'No file uploaded',
                    });
                    return;
                }
                const suratMasuk = yield suratmasukService_1.suratmasukService.createSuratmasuk(req.body, req.file, req.user.id);
                res.status(201).json({
                    data: suratMasuk,
                    status: 201,
                    message: 'Surat Masuk created successfully',
                });
            }
            catch (error) {
                console.error('Error occurred:', error);
                res.status(500).json({
                    status: 500,
                    message: 'Internal Server Error',
                    errors: error.message,
                });
            }
        });
    }
    static updateSuratmasuk(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Ubah dari suratmasukId menjadi no_surat_masuk
                const { no_surat_masuk } = req.params; // Sesuaikan dengan nama parameter di route
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || '';
                const file = req.file || null;
                console.log("Request Body:", req.body); // Tambahkan log untuk debugging
                const updatedSuratmasuk = yield suratmasukService_1.suratmasukService.updateSuratmasuk(no_surat_masuk, req.body, file, userId);
                res.status(200).json({
                    status: 'success',
                    data: updatedSuratmasuk
                });
            }
            catch (error) {
                console.error("Update Error:", error); // Tambahkan log error
                res.status(500).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
    static deleteSuratmasuk(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { suratmasukId } = req.params;
                yield suratmasukService_1.suratmasukService.deleteSuratmasuk(suratmasukId);
                res.status(200).json({ message: 'Suratmasuk deleted successfully' });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
}
exports.suratmasukController = suratmasukController;

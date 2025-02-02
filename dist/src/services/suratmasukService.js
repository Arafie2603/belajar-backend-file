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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suratmasukService = void 0;
const database_1 = require("../application/database");
const minioClient_1 = require("../helper/minioClient");
const suratmasukValidation_1 = require("../validation/suratmasukValidation");
const validation_1 = require("../validation/validation");
class suratmasukService {
    static createSuratmasuk(request, file, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.prismaClient.user.findUnique({
                where: { id: userId }
            });
            console.log("Original request : ", request);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }
            const modifiedRequest = Object.assign(Object.assign({}, request), { user_id: userId, tanggal: typeof request.tanggal === 'string'
                    ? new Date(request.tanggal).toISOString()
                    : new Date(JSON.stringify(request.tanggal)).toISOString(), expired_data: typeof request.expired_data === 'string'
                    ? new Date(request.expired_data).toISOString()
                    : new Date(JSON.stringify(request.expired_data)).toISOString() });
            console.log('modified request : ', modifiedRequest);
            const filename = `${Date.now()}-${file.originalname}`;
            const bucketName = 'suratmasuk';
            const fileUrl = `http://${minioClient_1.MINIO_ENDPOINT}:${minioClient_1.MINIO_PORT}/${bucketName}/${filename}`;
            const requestWithFile = Object.assign(Object.assign({}, modifiedRequest), { scan_surat: fileUrl, user_id: userId });
            const validationRequest = validation_1.Validation.validate(suratmasukValidation_1.suratmasukValidation.SuratmasukValidation, requestWithFile);
            const bucketExists = yield minioClient_1.minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                yield minioClient_1.minioClient.makeBucket(bucketName, 'us-east-1');
            }
            yield minioClient_1.minioClient.putObject(bucketName, filename, file.buffer);
            const suratmasuk = yield database_1.prismaClient.suratMasuk.create({
                data: {
                    no_surat_masuk: validationRequest.no_surat_masuk,
                    tanggal: validationRequest.tanggal,
                    alamat: validationRequest.alamat,
                    perihal: validationRequest.perihal,
                    tujuan: validationRequest.tujuan,
                    organisasi: validationRequest.organisasi,
                    pengirim: validationRequest.pengirim,
                    penerima: validationRequest.penerima,
                    sifat_surat: validationRequest.sifat_surat,
                    scan_surat: validationRequest.scan_surat,
                    expired_data: validationRequest.expired_data,
                    diteruskan_kepada: request.diteruskan_kepada,
                    tanggal_penyelesaian: request.tanggal_penyelesaian,
                    isi_disposisi: request.isi_disposisi,
                    user: {
                        connect: {
                            id: validationRequest.user_id
                        }
                    },
                },
                include: {
                    user: true,
                }
            });
            return suratmasuk;
        });
    }
    static updateSuratmasuk(nomor_surat_masuk, request, file, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield database_1.prismaClient.user.findUnique({
                    where: { id: userId },
                });
                if (!user) {
                    throw new Error(`User with ID ${userId} not found`);
                }
                const suratmasuk = yield database_1.prismaClient.suratMasuk.findUnique({
                    where: { no_surat_masuk: nomor_surat_masuk }
                });
                if (!suratmasuk) {
                    throw new Error(`suratmasuk with ID ${nomor_surat_masuk} not found`);
                }
                // Modifikasi penanganan tanggal
                const modifiedRequest = Object.assign(Object.assign({}, request), { user_id: userId, tanggal: request.tanggal ? new Date(request.tanggal) : undefined, expired_data: request.expired_data ? new Date(request.expired_data) : undefined });
                let fileUrl = suratmasuk.scan_surat;
                if (file) {
                    const filename = `${Date.now()}-${file.originalname}`;
                    const bucketName = 'suratmasuk';
                    fileUrl = `http://${minioClient_1.MINIO_ENDPOINT}:${minioClient_1.MINIO_PORT}/${bucketName}/${filename}`;
                    const bucketExists = yield minioClient_1.minioClient.bucketExists(bucketName);
                    if (!bucketExists) {
                        yield minioClient_1.minioClient.makeBucket(bucketName, 'us-east-1');
                    }
                    yield minioClient_1.minioClient.putObject(bucketName, filename, file.buffer);
                }
                console.log("Modified Request:", modifiedRequest); // Tambahkan log
                const { user_id } = modifiedRequest, updateData = __rest(modifiedRequest, ["user_id"]);
                const updateSuratmasuk = yield database_1.prismaClient.suratMasuk.update({
                    where: { no_surat_masuk: nomor_surat_masuk },
                    data: Object.assign(Object.assign({}, updateData), { scan_surat: fileUrl, user: { connect: { id: userId } } }),
                });
                return updateSuratmasuk;
            }
            catch (error) {
                console.error("Service Error:", error); // Tambahkan log error
                throw error;
            }
        });
    }
    static deleteSuratmasuk(no_surat_masuk) {
        return __awaiter(this, void 0, void 0, function* () {
            const suratmasuk = yield database_1.prismaClient.suratMasuk.findUnique({
                where: { no_surat_masuk: no_surat_masuk },
            });
            if (!suratmasuk) {
                throw new Error(`Surat masuk with ID ${no_surat_masuk} not found`);
            }
            yield database_1.prismaClient.suratMasuk.delete({
                where: { no_surat_masuk: no_surat_masuk },
            });
        });
    }
}
exports.suratmasukService = suratmasukService;

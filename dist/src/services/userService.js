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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const uuid_1 = require("uuid");
const userModel_1 = require("../model/userModel");
const userValidation_1 = require("../validation/userValidation");
const validation_1 = require("../validation/validation");
const database_1 = require("../application/database");
const responseError_1 = require("../error/responseError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authMiddleware_1 = require("../middleware/authMiddleware");
class userService {
    static getAllUsers() {
        return __awaiter(this, arguments, void 0, function* (page = 1, totalData = 10) {
            const skip = (page - 1) * totalData;
            const take = totalData;
            const [users, totalItems] = yield Promise.all([
                database_1.prismaClient.user.findMany({
                    skip,
                    take,
                    include: { role: true },
                }),
                database_1.prismaClient.user.count()
            ]);
            const totalPages = Math.ceil(totalItems / totalData);
            return {
                data: users.map(userModel_1.toUserResponse),
                meta: {
                    currentPage: page,
                    offset: skip,
                    itemsPerPage: totalData,
                    unpaged: false,
                    totalPages,
                    totalItems,
                    sortBy: [],
                    filter: {},
                }
            };
        });
    }
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Received request:", request);
            const registerRequest = validation_1.Validation.validate(userValidation_1.userValidation.REGISTER, request);
            const totalUserWithSameUsername = yield database_1.prismaClient.user.count({
                where: {
                    id: registerRequest.id,
                },
            });
            if (totalUserWithSameUsername !== 0) {
                throw new responseError_1.responseError(400, "Email already exists");
            }
            registerRequest.password = yield bcrypt_1.default.hash(registerRequest.password, 10);
            const { role_id } = registerRequest, userData = __rest(registerRequest, ["role_id"]);
            const user = yield database_1.prismaClient.user.create({
                data: Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, userData), { role: role_id ? { connect: { role_id } } : { create: { role_id: (0, uuid_1.v4)(), nama: 'user' } } }),
                include: {
                    role: true,
                },
            });
            const token = (0, authMiddleware_1.createToken)(user);
            console.log("User created:", user);
            return {
                user: (0, userModel_1.toUserResponse)(user),
                token,
            };
        });
    }
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = validation_1.Validation.validate(userValidation_1.userValidation.LOGIN, request);
            const user = yield database_1.prismaClient.user.findUnique({
                where: {
                    nomor_identitas: loginRequest.nomor_identitas,
                },
                include: {
                    role: true,
                },
            });
            if (!user) {
                throw new responseError_1.responseError(401, "Email or password is wrong");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(loginRequest.password, user.password);
            if (!isPasswordValid) {
                throw new responseError_1.responseError(401, "Email or password is wrong");
            }
            const token = (0, authMiddleware_1.createToken)(user);
            return {
                user: (0, userModel_1.toUserResponse)(user),
                token,
            };
        });
    }
    static updateUser(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(userValidation_1.userValidation.UPDATE, request);
            if (updateRequest.password) {
                updateRequest.password = yield bcrypt_1.default.hash(updateRequest.password, 10);
            }
            const { role_id } = updateRequest, userData = __rest(updateRequest, ["role_id"]);
            const user = yield database_1.prismaClient.user.update({
                where: {
                    id: userId,
                },
                data: Object.assign(Object.assign({}, userData), { role_id: role_id ? { connect: { role_id: role_id } } : undefined }),
                include: {
                    role: true,
                },
            });
            return (0, userModel_1.toUserResponse)(user);
        });
    }
    static deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.user.delete({
                where: {
                    id: userId,
                }
            });
        });
    }
}
exports.userService = userService;

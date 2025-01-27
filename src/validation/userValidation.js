"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
class userValidation {
}
exports.userValidation = userValidation;
userValidation.REGISTER = zod_1.z.object({
    id_user: zod_1.z.string().min(3).max(100),
    password: zod_1.z.string().min(1).max(100),
});
userValidation.LOGIN = zod_1.z.object({
    id_user: zod_1.z.string().min(3).max(100),
    password: zod_1.z.string().min(1).max(100),
});

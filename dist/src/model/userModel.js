"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
;
function toUserResponse(user) {
    var _a;
    return {
        id: user.id,
        nomor_identitas: user.nomor_identitas,
        password: user.password || "",
        role: (_a = user.role) === null || _a === void 0 ? void 0 : _a.nama,
    };
}

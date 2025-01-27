"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseError = void 0;
class responseError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.responseError = responseError;

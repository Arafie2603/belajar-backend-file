"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const zod_1 = require("zod");
const decimal_js_1 = __importDefault(require("decimal.js"));
class Validation {
    static validate(schema, data) {
        try {
            // Convert price to Decimal if necessary
            if (typeof data.price === 'number') {
                data.price = new decimal_js_1.default(data.price);
            }
            return schema.parse(data);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                throw new Error(`Validation Error: ${error.message}`);
            }
            throw error;
        }
    }
}
exports.Validation = Validation;

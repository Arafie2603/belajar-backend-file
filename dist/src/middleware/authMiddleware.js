"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        role: {
            role_id: user.role.role_id,
            nama: user.role.nama
        }
    }, JWT_SECRET, { expiresIn: '24h' });
};
exports.createToken = createToken;
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                status: 401,
                message: 'No token provided'
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            status: 401,
            message: 'Invalid token'
        });
    }
};
exports.authMiddleware = authMiddleware;

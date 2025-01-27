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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersRoute_1 = __importDefault(require("./src/routes/usersRoute"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = __importDefault(require("./prisma"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*', // Atau spesifik domain yang diizinkan
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});
app.use(express_1.default.json());
app.use('/api/users', usersRoute_1.default);
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
    process.exit(0);
}));
exports.default = app;

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
const cors_1 = __importDefault(require("cors"));
const usersRoute_1 = __importDefault(require("./src/routes/usersRoute"));
const suratmasukRoute_1 = __importDefault(require("./src/routes/suratmasukRoute"));
const prisma_1 = __importDefault(require("./prisma"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Filling API Documentation',
            version: '1.0.0',
            description: 'Documentation for E-Filling REST API'
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        servers: [
            {
                url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
                description: 'Current Server'
            }
        ],
        tags: [
            { name: 'home' },
            { name: 'auth' },
            { name: 'users' },
            { name: 'product' },
        ],
    },
    apis: ['./src/routes/*.ts']
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "E-Filling API Documentation",
    customfavIcon: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/favicon-32x32.png",
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
    },
    explorer: true
};
// Serve Swagger UI static files directly from the installed package
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, swaggerUiOptions));
// Serve Swagger UI static files
app.use('/api-docs/swagger-ui.css', express_1.default.static(path_1.default.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui.css')));
app.use('/api-docs/swagger-ui-bundle.js', express_1.default.static(path_1.default.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui-bundle.js')));
app.use('/api-docs/swagger-ui-standalone-preset.js', express_1.default.static(path_1.default.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js')));
app.use('/api-docs/swagger-ui-init.js', express_1.default.static(path_1.default.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui-init.js')));
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});
app.use('/api/users', usersRoute_1.default);
app.use('/api/surat', suratmasukRoute_1.default);
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
    process.exit(0);
}));
exports.default = app;

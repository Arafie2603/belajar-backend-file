import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import usersRoute from './src/routes/usersRoute';
import suratmasukRoute from './src/routes/suratmasukRoute';
import prisma from './prisma';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
app.use(express.json());

// Konfigurasi CORS
const corsOptions = {
    origin: [
        'http://localhost:3000',
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

// Konfigurasi Swagger
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
                description: 'API Server'
            }
        ],
        tags: [
            { name: 'home' },
            { name: 'auth' },
            { name: 'users' },
            { name: 'product' },
        ],
    },
    apis: ['./dist/src/routes/*.js'] // Point to compiled JS files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Setup Swagger UI tanpa custom CSS/JS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Your routes
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

app.use('/api/users', usersRoute);
app.use('/api/surat', suratmasukRoute);

// Prisma disconnect handlers
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export default app;
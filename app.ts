import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import usersRoute from './src/routes/usersRoute';
import suratmasukRoute from './src/routes/suratmasukRoute';
import prisma from './prisma';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const app = express();
app.use(express.json());

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

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

const swaggerSpec = swaggerJsdoc(swaggerOptions);

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

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Serve Swagger assets
app.get('/swagger-ui.css', (req, res) => {
    res.redirect('https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css');
});

app.get('/swagger-ui-bundle.js', (req, res) => {
    res.redirect('https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js');
});

app.get('/swagger-ui-standalone-preset.js', (req, res) => {
    res.redirect('https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js');
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

app.use('/api/users', usersRoute);
app.use('/api/surat', suratmasukRoute);

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export default app;
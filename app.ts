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
    },
    apis: [
        // Menambahkan path absolut ke file routes
        path.resolve(__dirname, './src/routes/*.ts'),
        path.resolve(__dirname, './src/routes/*.js'), 
        path.resolve(__dirname, 'app.ts'), 
    ]
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Serve Swagger UI static files directly from the installed package
app.use('/api-docs/swagger-ui.css', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui.css')));
app.use('/api-docs/swagger-ui-bundle.js', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui-bundle.js')));
app.use('/api-docs/swagger-ui-standalone-preset.js', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js')));
app.use('/api-docs/swagger-ui-init.js', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui-init.js')));

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

// // Logging untuk membantu debugging
// console.log('Swagger Spec:', JSON.stringify(swaggerSpec, null, 2));
// console.log('Routes Loaded:', app._router.stack.map((r: any) => r.route && r.route.path));

export default app;

import express from 'express';
import cors from 'cors';
import usersRoute from './src/routes/usersRoute';
import suratsRoute from './src/routes/suratmasukRoute';
import prisma from './prisma';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';
import { join } from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
const app = express();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Filling API Documentation',
            version: '1.0.0',
            description: 'Documentation for E-Filling REST API'
        },
        servers: [
            {
                url: 'https://belajar-backend-m84phemsa-arafie2603s-projects.vercel.app/', // Ganti dengan URL yang benar
                description: 'Production server'
            }
        ]
    },
    apis: ['./src/routes/*.ts'] // Pastikan jalur ke file rute sesuai
};
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const swaggerDocs = swaggerJsdoc(options);

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

app.use('/api/users', usersRoute);
app.use('/api/surat', suratsRoute);

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);

});

export default app;

import express from 'express';
import cors from 'cors';
import usersRoute from './src/routes/usersRoute';
import prisma from './prisma';

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use((req, res, next) => {
    console.log('Request Body:', req.body); // Log request body
    next();
});


app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

app.use('/api/users', usersRoute);

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export default app;

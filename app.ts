import express from 'express';
import usersRoute from './src/routes/usersRoute';
import cors from 'cors';
import prisma from './prisma';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

app.use(express.json());
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

import express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

export default (req: VercelRequest, res: VercelResponse) => app(req, res);

import express from 'express';
import cors from 'cors';
import foodbankManagerRoutes from './routes/foodbankManager.js';
import checkJwt from './routes/authentication';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const app: express.Application = express();

const clientPort = 5173;
const port = process.env.PORT || 3000;

// CORS config to allow frontend
const corsOptions = {
  origin: [`http://localhost:${clientPort}`],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Public endpoint — no authentication required
app.get('/public', (_req, res) => {
  res.send('This is a public endpoint.');
});

// Protected endpoint — requires a valid JWT (access token)
app.get('/protected', checkJwt, (req, res) => {
  res.send('You are accessing a protected endpoint!');
});

// Mount your routes
app.use('/api/fbm', foodbankManagerRoutes);

// Test endpoint
app.get('/', (_req, _res) => {
  _res.send("TypeScript With Express");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
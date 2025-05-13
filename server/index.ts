import express from 'express';
import cors from 'cors';
import foodbankManagerRoutes from './routes/foodbankManager.js';

const app: express.Application = express();

const clientPort = 5173;
const port = 3000;

// CORS config to allow frontend
const corsOptions = {
  origin: [`http://localhost:${clientPort}`],
};
app.use(cors(corsOptions));

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
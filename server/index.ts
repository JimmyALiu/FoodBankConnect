import express from 'express';
import cors from 'cors';
import foodbankManagerRoutes from './routes/foodbankManager';
import checkJwt from './routes/authentication';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { internalFormGuests } from './inMemoryStorage/cache';
import { startInternalTimer } from './src/internalTimer';

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

// Login route (optional, usually frontend handles this)
app.get('/login', (_req, res) => {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const redirectUri = process.env.AUTH0_CALLBACK_URL || 'http://localhost:5173';

  const loginUrl = `https://${domain}/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid profile email`;
  res.redirect(loginUrl);
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token'); // if you use cookies
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const returnTo = process.env.AUTH0_LOGOUT_REDIRECT_URI || 'http://localhost:5173';

  const logoutUrl = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`;
  res.redirect(logoutUrl);
});

//get stored filled out form data
//this is currently unmodifiable, only gets it from the forms
app.get('/get-form-data', (req: Request, res: Response) => {
  res.json(Array.from(internalFormGuests));
});

// Protected route
app.get('/protected', checkJwt, (req, res) => {
  res.send('This is a protected route.');
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

//internal background logic to update the internal cache
startInternalTimer(); // kicks off interval
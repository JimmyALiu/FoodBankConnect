import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Emulate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading from project root or server/.env depending on what's available
const rootEnvPath = path.resolve(__dirname, '..', '.env');
const serverEnvPath = path.resolve(__dirname, '.env');

const envPath = fs.existsSync(serverEnvPath)
  ? serverEnvPath
  : rootEnvPath;

dotenv.config({ path: envPath });

//console.log('Jest setup: API_BASE =', process.env.API_BASE);
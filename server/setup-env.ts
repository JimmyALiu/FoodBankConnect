// setup-env.ts (ESM compatible)
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// 👇 ESM-compatible __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 Load .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log("Jest setup: API_BASE =", process.env.API_BASE);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports (IMPORTANT: include .js)
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import listingRoutes from './src/routes/listing.routes.js';
import matchRoutes from './src/routes/match.routes.js';
import messageRoutes from './src/routes/message.routes.js';

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/messages', messageRoutes);

// ── Health check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'CoNest API running 🏠' });
});

export { app };
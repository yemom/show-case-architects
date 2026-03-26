import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import connectDB from './configs/db.js';
import adminRouter from './route/adminRoute.js';
import blogRoute from './route/blogRoute.js';
import path from 'path';

// Load environment variables
const envResult = dotenv.config();
if (envResult.error) {
  console.error("Error loading .env file:", envResult.error);
} else {
  console.log(`Loaded ${Object.keys(envResult.parsed || {}).length} environment variables from .env`);
}


const app = express();

const normalizeOrigin = (value) => String(value || '').trim().replace(/\/$/, '').toLowerCase();

const isTest = process.env.NODE_ENV === "test";

// Single DB connection (connectDB should handle mongoose connect)
if (!isTest) {
  await connectDB();
}

// Serve uploaded media as HTTP (NOT file://)
// Fallback handlers to support legacy files saved directly under /uploads
app.get('/uploads/images/:file', (req, res, next) => {
  const imagesPath = path.join(process.cwd(), 'uploads', 'images', req.params.file);
  const legacyPath = path.join(process.cwd(), 'uploads', req.params.file);
  if (fs.existsSync(imagesPath)) return res.sendFile(imagesPath);
  if (fs.existsSync(legacyPath)) return res.sendFile(legacyPath);
  return next();
});

app.get('/uploads/videos/:file', (req, res, next) => {
  const videosPath = path.join(process.cwd(), 'uploads', 'videos', req.params.file);
  const legacyPath = path.join(process.cwd(), 'uploads', req.params.file);
  if (fs.existsSync(videosPath)) return res.sendFile(videosPath);
  if (fs.existsSync(legacyPath)) return res.sendFile(legacyPath);
  return next();
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // primary static serve

const defaultAllowedOrigins = [
  'http://localhost:8081',
  'http://localhost:5173',
  'http://localhost:3000',
];

const configuredOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.FRONTEND_ORIGIN_PROD,
  ...(process.env.FRONTEND_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
].filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...configuredOrigins].map(normalizeOrigin))];

// If your Vercel project is studio21-architects, set FRONTEND_VERCEL_PROJECT=studio21-architects
const vercelProject = process.env.FRONTEND_VERCEL_PROJECT;
const vercelPreviewRegex = vercelProject
  ? new RegExp(`^https://[a-z0-9-]+-${vercelProject}\\.vercel\\.app$`, 'i')
  : null;
const allowAnyVercelOrigin = String(process.env.ALLOW_VERCEL_ORIGINS || '').toLowerCase() === 'true';

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server calls or curl/Postman without Origin header
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
    if (vercelPreviewRegex && vercelPreviewRegex.test(origin)) return callback(null, true);
    if (allowAnyVercelOrigin && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// (Removed duplicate static serve)

/// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Routes (mount exactly once)
app.get('/', (req, res) => res.send('API is working'));
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRoute);

// ------------------ Error Handling ------------------
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

if (!isTest) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} and accessible via LAN`);
  });

}

export default app;
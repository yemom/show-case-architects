import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
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

app.use(cors())
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
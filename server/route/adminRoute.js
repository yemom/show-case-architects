import express from 'express';
import path from 'path';
import multer from 'multer';
import { addBlog, getAllBlogs} from '../controllers/blogController.js';
import { adminLogin, adminSignup,  getDashboard, getAllComments, deleteCommentById, ApprovedCommentById, listAdmins, approveAdmin, requestAdminAccess, deleteAdmin, forgotPassword, resetPassword, forgotPasswordCode, resetPasswordWithCode } from '../controllers/adminController.js';
import auth from '../midleware/auth.js';
import Comment from '../models/comment.js';


const router = express.Router();

// Ensure uploads folder exists on disk
// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads')); // ensure 'uploads' exists
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safe}`);
  },
});

// Multer upload
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max for videos
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|mkv|webm/;
    if (allowed.test(file.mimetype) || allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});
// Add blog (protected, multer)
router.post(
  '/add',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
  addBlog
);


// Get all blogs for frontend (public)
router.get('/blogs', getAllBlogs);

// Admin login
router.post('/login', adminLogin);
// Admin signup
router.post('/signup', adminSignup);
// Request admin access (creates pending admin)
router.post('/request-access', requestAdminAccess);
// Forgot & reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// Code based reset
router.post('/forgot-password-code', forgotPasswordCode);
router.post('/reset-password-code', resetPasswordWithCode);

// Super-admin protected endpoints
router.get('/admins', auth, async (req, res, next) => {
  // Only super admin can list
  if (req.admin?.role !== 'super') return res.status(403).json({ success: false, message: 'Forbidden' });
  return listAdmins(req, res, next);
});

router.post('/approve-admin', auth, async (req, res, next) => {
  if (req.admin?.role !== 'super') return res.status(403).json({ success: false, message: 'Forbidden' });
  return approveAdmin(req, res, next);
});

router.post('/delete-admin', auth, async (req, res, next) => {
  if (req.admin?.role !== 'super') return res.status(403).json({ success: false, message: 'Forbidden' });
  return deleteAdmin(req, res, next);
});

// Dashboard
router.get('/dashboard', auth, getDashboard);

// Comments
// Fetch all comments (protected)
router.get('/comment', auth, async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'blog', select: 'title', strictPopulate: false });
    res.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Approve a comment (protected)
router.post('/approved-comment', auth, ApprovedCommentById);

// Delete a comment (protected)
router.post('/delete-comment', auth, deleteCommentById);





export default router;

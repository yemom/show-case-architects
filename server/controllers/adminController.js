import jwt from 'jsonwebtoken';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import Admin from '../models/admin.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';


const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const toDisplayName = (email = '') => {
  const local = String(email).trim().split('@')[0] || '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'Admin';
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};



export const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email & password required' });
    }
    // Do NOT auto-create or auto-approve admins via this endpoint.
    // Instead create a pending admin request that must be approved by a super admin.
    const exists = await Admin.findOne({ email: String(email).trim().toLowerCase() });
    if (exists) {
      // If an account exists and is approved, reject; if it exists but pending, refresh password and keep pending
      if (exists.isApproved) {
        return res.status(409).json({ success: false, message: 'Admin already exists' });
      }
      // Update password for pending request
      exists.password = await bcrypt.hash(password, 10);
      await exists.save();
      return res.json({ success: true, message: 'Your admin access request is pending approval by a super admin.' });
    }

    const hash = await bcrypt.hash(password, 10);
    await Admin.create({ email: String(email).trim().toLowerCase(), password: hash, role: 'admin', isApproved: false });
    return res.json({ success: true, message: 'Admin access request submitted. A super admin must approve your account.' });
  } catch (err) {
    console.error('adminSignup error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email & password required' });
    }

    // Normalize to avoid whitespace/case issues
    const inputEmail = String(email).trim().toLowerCase();
    const inputPassword = String(password).trim();
    const envEmail = String(ADMIN_EMAIL || '').trim().toLowerCase();
    const envPassword = String(ADMIN_PASSWORD || '').trim();

    // 1) Prefer .env SUPER ADMIN credentials first (always issue super token)
    if (inputEmail === envEmail && inputPassword === envPassword) {
      const token = jwt.sign({ role: 'super', email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, message: 'Login successful', token });
    }

    // 2) DB-based admin
    const admin = await Admin.findOne({ email: inputEmail });
    if (admin) {
      const ok = await bcrypt.compare(inputPassword, admin.password);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      if (!admin.isApproved) {
        return res.status(403).json({ success: false, message: 'Your account is pending approval by a super admin.' });
      }
      const token = jwt.sign({ role: admin.role || 'admin', email: admin.email, id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, message: 'Login successful', token });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (err) {
    console.error('adminLogin error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCurrentAdmin = async (req, res) => {
  try {
    const authAdmin = req.admin || {};
    let adminDoc = null;

    if (authAdmin.id) {
      adminDoc = await Admin.findById(authAdmin.id).select('email role isApproved name');
    }

    const email = adminDoc?.email || authAdmin.email || '';
    const role = adminDoc?.role || authAdmin.role || 'admin';
    const displayName = (adminDoc?.name && String(adminDoc.name).trim()) || toDisplayName(email);

    return res.json({
      success: true,
      admin: {
        id: adminDoc?._id || authAdmin.id || null,
        email,
        role,
        isApproved: typeof adminDoc?.isApproved === 'boolean' ? adminDoc.isApproved : role === 'super',
        displayName,
      },
    });
  } catch (err) {
    console.error('getCurrentAdmin error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const listAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json({ success: true, admins });
  } catch (err) {
    console.error('listAdmins error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const approveAdmin = async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: 'Admin id required' });
    const admin = await Admin.findByIdAndUpdate(id, { isApproved: true }, { new: true }).select('-password');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.json({ success: true, admin });
  } catch (err) {
    console.error('approveAdmin error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: 'Admin id required' });

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    // Prevent deleting super admins or the .env super account
    const envEmail = String(ADMIN_EMAIL || '').trim().toLowerCase();
    if (admin.role === 'super' || admin.email.toLowerCase() === envEmail) {
      return res.status(403).json({ success: false, message: 'Cannot delete a super admin' });
    }

    await Admin.findByIdAndDelete(id);
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('deleteAdmin error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const requestAdminAccess = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email & password required' });

    // If no admins exist yet, instruct to use /signup for the first super admin
    const count = await Admin.countDocuments();
    if (count === 0) {
      return res.status(400).json({ success: false, message: 'No super admin exists. Use /api/admin/signup to submit the initial admin access request.' });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      if (existing.isApproved) {
        return res.status(409).json({ success: false, message: 'This email is already an approved admin.' });
      }
      // Optionally refresh password for pending request
      const hash = await bcrypt.hash(password, 10);
      existing.password = hash;
      await existing.save();
      return res.json({ success: true, message: 'Your admin access request is already pending approval.' });
    }

    const hash = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hash, role: 'admin', isApproved: false });
    return res.json({ success: true, message: 'Admin access request submitted. A super admin must approve your account.' });
  } catch (err) {
    console.error('requestAdminAccess error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ================= PASSWORD RESET FLOW =================
// POST /api/admin/forgot-password  { email }
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    const admin = await Admin.findOne({ email: String(email).trim().toLowerCase() });
    if (!admin) {
      // Do not reveal that email doesn't exist
      return res.json({ success: true, message: 'If that email exists, a reset link has been generated.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 minutes
    await admin.save();

    // In real implementation send email. For now log to server console.
    const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${BASE_URL}/admin/reset-password?token=${token}&email=${encodeURIComponent(admin.email)}`;
    console.log('Password reset link:', resetLink);
    return res.json({ success: true, message: 'If that email exists, a reset link has been generated.', resetLink: process.env.NODE_ENV==='development'? resetLink: undefined });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/admin/reset-password  { email, token, password }
export const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body || {};
    if (!email || !token || !password) return res.status(400).json({ success: false, message: 'Email, token & new password required' });
    const admin = await Admin.findOne({ email: String(email).trim().toLowerCase(), resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!admin) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    return res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('resetPassword error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== CODE-BASED RESET (no link) =====
// POST /api/admin/forgot-password-code { email }
export const forgotPasswordCode = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    const admin = await Admin.findOne({ email: String(email).trim().toLowerCase() });
    // Always respond success style to avoid enumeration
    if (!admin) return res.json({ success: true, message: 'If that email exists, a reset code has been sent.' });

    // 6-digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetPasswordCode = code;
    admin.resetPasswordCodeExpires = Date.now() + 1000 * 60 * 15; // 15 mins
    await admin.save();

    // For now, just log the code. In production send via email or SMS.
    console.log(`Password reset code for ${admin.email}: ${code}`);
    return res.json({ success: true, message: 'If that email exists, a reset code has been sent.' });
  } catch (err) {
    console.error('forgotPasswordCode error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/admin/reset-password-code { email, code, password }
export const resetPasswordWithCode = async (req, res) => {
  try {
    const { email, code, password } = req.body || {};
    if (!email || !code || !password) return res.status(400).json({ success: false, message: 'Email, code & new password required' });
    const admin = await Admin.findOne({
      email: String(email).trim().toLowerCase(),
      resetPasswordCode: code,
      resetPasswordCodeExpires: { $gt: Date.now() }
    });
    if (!admin) return res.status(400).json({ success: false, message: 'Invalid or expired code' });
    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordCode = undefined;
    admin.resetPasswordCodeExpires = undefined;
    await admin.save();
    return res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('resetPasswordWithCode error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addBlog = async (req, res) => {
  try {
    let { title, subTitle, description, category, isPublished } = req.body;

    const imageFile = req.files?.image?.[0] || null;
    const videoFile = req.files?.video?.[0] || null;

    const imagePath = imageFile ? `/uploads/${imageFile.filename}` : null;
    const videoPath = videoFile ? `/uploads/${videoFile.filename}` : null;

    const newBlog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      isPublished: isPublished === "true" || isPublished === true,
      image: imagePath,
      video: videoPath,
    });

    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

    return res.json({
      success: true,
      message: "Blog added successfully",
      blog: {
        ...newBlog.toObject(),
        image: newBlog.image ? `${BASE_URL}${newBlog.image}` : null,
        video: newBlog.video ? `${BASE_URL}${newBlog.video}` : null,
      },
    });
  } catch (err) {
    console.error("addBlog error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


export const getAllBlogs = async (req, res) => {
    try {
  // Admins should be able to see all blogs, including drafts
  const blogs = await Blog.find();
  
      const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';
  
      const formatted = blogs.map(blog => ({
        ...blog.toObject(),
        image: blog.image ? `${BASE_URL}${blog.image}` : null,
        video: blog.video ? `${BASE_URL}${blog.video}` : null,
      }));
  
      res.json({ success: true, message: 'Blogs fetched successfully', blogs: formatted });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  



export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate('blog', 'title').sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getDashboard = async (req, res) => {
    try {
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({ isPublished: false });
        const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            success: true,
            dashboardData: { blogs, comments, drafts, recentBlogs },
        });
    } catch (err) {
        console.error('getDashboard error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const ApprovedCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        res.json({ success: true, message: "Comment update successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super'], default: 'admin' },
  isApproved: { type: Boolean, default: false },
  // Password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  // Code based reset (alternative to link)
  resetPasswordCode: { type: String },
  resetPasswordCodeExpires: { type: Date },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;

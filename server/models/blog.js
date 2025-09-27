import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  description: { type: String, required: true }, // <- this is mandatory
  category: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  image: String,
  video: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Blog', blogSchema);

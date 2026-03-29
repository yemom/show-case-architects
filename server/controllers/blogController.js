import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import imageKit from '../configs/imageKit.js';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import main from '../configs/gmini.js';

// Helpers to construct absolute URLs based on the current request origin
const getReqBase = (req) => {
  try {
    const host = req.get('host');
    const protocol = req.protocol;
    if (host && protocol) return `${protocol}://${host}`;
  } catch { }
  // Fallback to env or sensible default
  const raw = process.env.BASE_URL || 'http://127.0.0.1:3000';
  return raw.replace(/\/$/, '');
};

const toAbsoluteUrl = (base, p) => {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p; // already absolute
  const rel = (p || '').replace(/^\//, '');
  return `${base}/${rel}`;
};

// Ensure we store/return a relative path like 'uploads/images/xxx.jpg'
const toRelativeUploadPath = (p) => {
  if (!p) return null;
  const normalized = p.replace(/\\/g, '/');
  // If it already contains 'uploads/', trim to that
  const m = normalized.match(/uploads\/.+/);
  if (m) return m[0];
  // Already relative
  if (/^uploads\//.test(normalized)) return normalized;
  // Fallback: filename only
  return 'uploads/' + normalized.split('/').pop();
};

const convertUploadImageToWebp = async (file) => {
  if (!file || !file.path) return null;

  const ext = path.extname(file.path).toLowerCase();
  if (ext === '.webp') return toRelativeUploadPath(file.path);

  const outputPath = path.join(
    path.dirname(file.path),
    `${path.basename(file.path, ext)}.webp`
  );

  await sharp(file.path).webp({ quality: 82 }).toFile(outputPath);

  try {
    await fs.promises.unlink(file.path);
  } catch {
    // If cleanup fails, keep request successful and continue.
  }

  return toRelativeUploadPath(outputPath);
};

export const addBlog = async (req, res) => {
  try {
    // Support both raw fields and JSON 'blog'
    let title, subTitle, description, category, isPublished;
    if (req.body.blog) {
      ({ title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog));
    } else {
      ({ title, subTitle, description, category, isPublished } = req.body);
    }

    const imageFile = req.file || (req.files?.image?.[0] || null);
    const videoFile = req.files?.video?.[0] || null;

    const imagePath = imageFile ? await convertUploadImageToWebp(imageFile) : null;
    const videoPath = videoFile ? toRelativeUploadPath(videoFile.path) : null;

    const newBlog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      isPublished: isPublished === 'true' || isPublished === true,
      image: imagePath,
      video: videoPath
    });

    const BASE = getReqBase(req);
    res.json({
      success: true,
      blog: {
        ...newBlog.toObject(),
        image: toAbsoluteUrl(BASE, newBlog.image),
        video: toAbsoluteUrl(BASE, newBlog.video)
      }
    });
  } catch (err) {
    console.error('addBlog error:', err);
    res.status(500).json({ success: false, message: "We couldn't publish this post right now. Please try again." });
  }
};




export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    const BASE = getReqBase(req);
    const formatted = blogs.map(blog => ({
      ...blog.toObject(),
      image: toAbsoluteUrl(BASE, blog.image),
      video: toAbsoluteUrl(BASE, blog.video),
    }));

    res.json({ success: true, message: 'Blogs fetched successfully', blogs: formatted });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'We could not load posts right now. Please try again.' });
  }
};






export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'This post could not be found.' });
    }

    const BASE = getReqBase(req);
    res.json({
      success: true,
      blog: {
        ...blog.toObject(),
        image: toAbsoluteUrl(BASE, blog.image),
        video: toAbsoluteUrl(BASE, blog.video),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'We could not load this post right now. Please try again.' });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);
    //Delete all comments associated with the blog
    await Comment.deleteMany({ blog: id });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: 'We could not delete this post right now. Please try again.' });
  }
}
export const onTogglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog publish status updated successfully", isPublished: blog.isPublished });
  } catch (error) {
    console.error("Error updating blog publish status:", error);
    res.status(500).json({ success: false, message: 'We could not update publish status right now. Please try again.' });
  }
}

export const updateBlogCategory = async (req, res) => {
  try {
    const { id, category } = req.body || {};
    const nextCategory = String(category || '').trim();

    if (!id || !nextCategory) {
      return res.status(400).json({ success: false, message: 'Blog id and category are required' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { category: nextCategory },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const BASE = getReqBase(req);
    return res.json({
      success: true,
      message: 'Blog category updated successfully',
      blog: {
        ...updatedBlog.toObject(),
        image: toAbsoluteUrl(BASE, updatedBlog.image),
        video: toAbsoluteUrl(BASE, updatedBlog.video),
      },
    });
  } catch (error) {
    console.error('Error updating blog category:', error);
    return res.status(500).json({ success: false, message: 'We could not update the category right now. Please try again.' });
  }
}
export const updateBlog = async (req, res) => {
  try {
    const { id, title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    // Validate required fields
    if (!id || !title || !description || !category) {
      return res.status(400).json({ message: "ID, title, description, and category are required." });
    }

    let imageUrl;
    if (imageFile) {
      const fileBuffer = fs.readFileSync(imageFile.path);

      // Upload image to imagekit
      const imageUploadResponse = await imageKit.upload({
        file: fileBuffer,
        fileName: imageFile.originalname,
        folder: "/blogs"
      });

      imageUrl = imageUploadResponse.url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, {
      title,
      subTitle,
      description,
      category,
      image: imageUrl || undefined, // Update only if a new image is provided
      isPublished
    }, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, message: 'We could not update this post right now. Please try again.' });
  }
}

export const addComment = async (req, res) => {
  try {
    const { blogId, name, email, comment } = req.body;

    // Validate required fields
    if (!blogId || !name || !comment) {
      return res.status(400).json({ message: "Blog ID, name, and comment are required." });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await Comment.create({ blog: blogId, name, email: email || '', comment });

    res.json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: 'We could not add your comment right now. Please try again.' });
  }
}

export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId }).sort({ createdAt: -1 }).populate('blog', 'title');

    res.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: 'We could not load comments right now. Please try again.' });
  }
}

export const generateContent = async (req, res) => {
  try {
    // Accept prompt from body (text) and optional uploaded image from multer
    const { prompt } = req.body || {};

    // If an image was uploaded, prefer to upload it to ImageKit and include its URL in the prompt
    const imageFile = req.file || (req.files && (req.files.image ? req.files.image[0] : null));
    let imageUrl = null;
    if (imageFile) {
      try {
        const relativePath = await convertUploadImageToWebp(imageFile);
        const absolutePath = relativePath ? path.join(process.cwd(), relativePath) : imageFile.path;
        const fileBuffer = fs.readFileSync(absolutePath);
        const uploadResp = await imageKit.upload({
          file: fileBuffer,
          fileName: path.basename(absolutePath),
          folder: '/blogs'
        });
        imageUrl = uploadResp?.url || null;
      } catch (imgErr) {
        console.error('Image upload failed for generateContent:', imgErr);
        // continue without imageUrl
      }
    }

    // Compose prompt including the image URL (if any)
    let composedPrompt = (prompt || '').trim();
    if (imageUrl) {
      composedPrompt += `\n\nImage URL: ${imageUrl}\nPlease generate a blog post (title, subtitle, and body) inspired by this image and the topic above. Use plain text or minimal HTML.`;
    } else {
      composedPrompt += ' Generate a blog content for this topic in simple text format.';
    }

    const content = await main(composedPrompt);
    res.json({ success: true, content });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ success: false, message: 'Content generation is unavailable right now. Please try again.' });
  }
}
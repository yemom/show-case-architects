import express from "express";
import { addBlog, addComment, deleteBlog, generateContent, getAllBlogs, getBlogById, getComments, onTogglePublish } from '../controllers/blogController.js'
import upload from "../midleware/multter.js";
import auth from "../midleware/auth.js";

const blogRoute = express.Router();

// Multer wrapper to catch errors and avoid raw 500
const uploadBlogMedia = (req, res, next) => {
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ])(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

blogRoute.post("/add", uploadBlogMedia, addBlog);
blogRoute.get("/all", getAllBlogs);
blogRoute.post("/add-comment", addComment);
blogRoute.get("/comment/:blogId", getComments);
blogRoute.delete("/delete", auth, deleteBlog);
blogRoute.post("/toggle-publish", auth, onTogglePublish);
blogRoute.get("/:blogId", getBlogById);
blogRoute.post("/generate-content", auth, generateContent);

export default blogRoute;
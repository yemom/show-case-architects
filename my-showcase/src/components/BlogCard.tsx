import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "axios";

// API client without context (avoids type error)
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";
const api = Axios.create({ baseURL: API_BASE }); 

// Helper: convert server path into absolute URL using baseURL/env
const getMediaUrl = (p: string | null | undefined, apiBaseFromAxios?: string | null) => {
  if (!p) return null;
  const fallbackBase = apiBaseFromAxios || API_BASE;
  const base = (fallbackBase || "").replace(/\/$/, "");
  if (/^https?:\/\//i.test(p)) return p;
  const normalized = p.replace(/\\/g, "/");
  const rel = normalized.match(/uploads\/.+/)?.[0] || normalized.replace(/^\//, "");
  return `${base}/${rel}`.replace(/([^:]\/)\/+/, "$1");
};

// Strip tags for safe plain-text preview
const stripHtml = (html: string) =>
  html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .trim();

type Blog = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  image?: string | null;
  video?: string | null;
};

type BlogComment = {
  _id: string;
  name: string;
  content?: string;
  comment?: string;
  createdAt: string;
  isApproved?: boolean;
};

type Props = { blog: Blog };

const BlogCard: React.FC<Props> = ({ blog }) => {
  const navigate = useNavigate();
  const { title, description, category, image, video, _id } = blog;

  const imgSrc = useMemo(() => getMediaUrl(image, API_BASE), [image]);
  const videoSrc = useMemo(() => getMediaUrl(video, API_BASE), [video]);

  const [currentImgSrc, setCurrentImgSrc] = useState<string | null>(imgSrc || null);
  const [currentVidSrc, setCurrentVidSrc] = useState<string | null>(videoSrc || null);
  const [imgError, setImgError] = useState(false);
  const [vidError, setVidError] = useState(false);

  const goto = () => _id && navigate(`/blog/${_id}`);

  // Comments state
  const [openComments, setOpenComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    if (!_id) return;
    setLoadingComments(true);
    try {
      const { data } = await api.get(`/api/blog/comment/${_id}`);
      const list: BlogComment[] = data?.comments || data?.data || [];
      setComments(Array.isArray(list) ? list : []);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (openComments) fetchComments();
  }, [openComments, _id]);

  const submitComment = async (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error("Please enter your name and comment");
      return;
    }
    setPosting(true);
    try {
      // Prefer add-comment; fallback to comment
      const primary = await api.post(`/api/blog/add-comment`, {
        blogId: _id,
        name,
        content,
        comment: content,
      });
      const ok = primary?.data?.success ?? true;
      if (!ok) {
        await api.post(`/api/blog/comment`, {
          blogId: _id,
          name,
          content,
          comment: content,
        });
      }
      toast.success("Thanks! Your comment is pending approval.");
      setName("");
      setContent("");
      fetchComments();
    } catch {
      toast.error("Failed to submit comment");
    } finally {
      setPosting(false);
    }
  };

  const previewText = stripHtml(String(description ?? "")).slice(0, 120);

  return (
    <motion.div
      onClick={goto}
      className="w-full blog-card card-elevate overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35 }}
      role="article"
    >
      {/* Media */}
      {!vidError && currentVidSrc ? (
        <div className="aspect-video w-full relative overflow-hidden">
          <video
            src={currentVidSrc}
            onError={() => {
              if (currentVidSrc && /\/uploads\/videos\//.test(currentVidSrc)) {
                const alt = currentVidSrc.replace("/uploads/videos/", "/uploads/");
                setCurrentVidSrc(alt);
              } else setVidError(true);
            }}
            controls
            className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.03]"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        </div>
      ) : !imgError && currentImgSrc ? (
        <div className="aspect-video w-full relative overflow-hidden">
          <img
            src={currentImgSrc}
            onError={() => {
              if (currentImgSrc && /\/uploads\/images\//.test(currentImgSrc)) {
                const alt = currentImgSrc.replace("/uploads/images/", "/uploads/");
                setCurrentImgSrc(alt);
              } else setImgError(true);
            }}
            alt={title || "Blog media"}
            className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.03]"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
          No media
        </div>
      )}

      {/* Category pill */}
      {category ? (
        <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">
          {category}
        </span>
      ) : null}

      {/* Content + Comments */}
      <div className="p-5" onClick={(e) => e.stopPropagation()}>
        <h5 className="mb-2 font-medium text-gray-900">{title}</h5>
        <p className="mb-3 text-xs text-gray-600">{previewText}…</p>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setOpenComments((s) => !s)}
            className="text-xs rounded-full border px-3 py-1 text-gray-700 hover:text-primary hover:border-primary transition-colors"
            aria-expanded={openComments}
          >
            {openComments ? "Hide comments" : `Comments (${comments.length})`}
          </button>

          {openComments && (
            <div className="mt-4 space-y-4">
              <div className="space-y-3">
                {loadingComments ? (
                  <p className="text-xs text-gray-500">Loading comments…</p>
                ) : comments.length ? (
                  comments
                    .filter((c) => c.isApproved !== false)
                    .map((c) => (
                      <div key={c._id} className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-800">{c.name}</span>
                          <span className="text-[10px] text-gray-500">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mt-1">{c.content ?? c.comment}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-gray-500">No comments yet.</p>
                )}
              </div>

              <form onSubmit={submitComment} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
                <textarea
                  placeholder="Write a comment…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
                  required
                />
                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={posting}
                    className="rounded-md bg-accent text-white text-xs px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 transition"
                  >
                    {posting ? "Posting…" : "Post comment"}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500">Comments are moderated. Approved comments appear shortly.</p>
              </form>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
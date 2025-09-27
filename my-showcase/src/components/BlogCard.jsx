// src/components/BlogCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

/**
 * Helper: convert server path (like "/uploads/images/xxx.jpg" or "uploads\images\xxx.jpg")
 * into absolute URL using env var VITE_API_URL or window.location.origin fallback.
 */
const getMediaUrl = (p, apiBaseFromAxios) => {
  if (!p) return null;
  // Prefer axios baseURL (same origin as API), then Vite envs, then current origin
  const fallbackBase = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || window.location.origin);
  const apiBase = (apiBaseFromAxios || fallbackBase || "").replace(/\/$/, "");

  // Already absolute URL
  if (/^https?:\/\//i.test(p)) return p;

  // Normalize path and extract uploads/... if present
  const normalized = p.replace(/\\/g, "/");
  const rel = normalized.match(/uploads\/.+/)?.[0] || normalized.replace(/^\//, "");
  // Ensure we point to /uploads/... on the API base
  return `${apiBase}/${rel}`.replace(/([^:]\/)\/+/, "$1");
};

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const { title, description, category, image, video, _id } = blog || {};
  const { axios } = useAppContext();

  const safeDesc = typeof description === "string" ? description : "";
  const imgSrc = getMediaUrl(image, axios?.defaults?.baseURL);
  const videoSrc = getMediaUrl(video, axios?.defaults?.baseURL);

  // Stateful media URLs to allow client-side fallback
  const [currentImgSrc, setCurrentImgSrc] = useState(imgSrc || null);
  const [currentVidSrc, setCurrentVidSrc] = useState(videoSrc || null);

  // state flags for error fallback (no undefined vars)
  const [imgError, setImgError] = useState(false);
  const [vidError, setVidError] = useState(false);

  const goTo = () => navigate(`/blog/${_id}`);

  return (
    <motion.div
      onClick={goTo}
      className="w-full blog-card card-elevate overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35 }}
    >
      {/* media area */}
      {(!vidError && currentVidSrc) ? (
        <div className="aspect-video w-full relative overflow-hidden">
          <video
            src={currentVidSrc}
            onError={() => {
              console.warn("Video load error:", currentVidSrc);
              // Try fallback from /uploads/videos/* -> /uploads/* once
              if (currentVidSrc && /\/uploads\/videos\//.test(currentVidSrc)) {
                const alt = currentVidSrc.replace('/uploads/videos/', '/uploads/');
                setCurrentVidSrc(alt);
              } else {
                setVidError(true);
              }
            }}
            controls
            className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.03]"
            onClick={(e) => e.stopPropagation()} // allow play/controls without navigating
          />
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        </div>
      ) : (!imgError && currentImgSrc) ? (
        <div className="aspect-video w-full relative overflow-hidden">
          <img
            src={currentImgSrc}
            onError={() => {
              console.warn("Image load error:", currentImgSrc);
              // Try fallback from /uploads/images/* -> /uploads/* once
              if (currentImgSrc && /\/uploads\/images\//.test(currentImgSrc)) {
                const alt = currentImgSrc.replace('/uploads/images/', '/uploads/');
                setCurrentImgSrc(alt);
              } else {
                setImgError(true);
              }
            }}
            alt={title}
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

      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">
        {category}
      </span>

      <div className="p-5">
        <h5 className="mb-2 font-medium text-gray-900">{title}</h5>
        <p className="mb-3 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: safeDesc.slice(0, 80) }} />
      </div>
    </motion.div>
  );
};

export default BlogCard;

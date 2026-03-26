import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { assets } from "../assets/assets";
import Axios from "axios";

dayjs.extend(relativeTime);

// Stable API base for all calls (prevents requests to 8080)
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";
const api = Axios.create({ baseURL: API_BASE }); // removed withCredentials to avoid CORS

// Build absolute media URL
const toAbsolute = (url?: string | null) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const p = url.startsWith("/") ? url : `/${url}`;
  return `${API_BASE}${p}`;
};

type BlogData = {
  _id: string;
  title: string;
  subTitle?: string;
  description?: string; // HTML
  category?: string;
  image?: string | null;
  video?: string | null;
  createdAt?: string;
};

type BlogComment = {
  _id: string;
  name: string;
  content?: string; // API may use `content`
  comment?: string; // or `comment`
  createdAt: string;
  isApproved?: boolean;
};

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // optional
  const [comment, setComment] = useState("");

  const mediaSrc = useMemo(() => {
    if (!data) return null;
    return data.video ? toAbsolute(data.video) : toAbsolute(data.image);
  }, [data]);

  const fetchBlogData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/blog/${id}`);
      const ok = res?.data?.success ?? true;
      const blog = res?.data?.blog ?? res?.data?.data ?? res?.data;
      if (ok && blog) setData(blog);
      else toast.error(res?.data?.message || "Failed to load blog");
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  // Correct endpoint: singular "comment"
  const fetchComments = async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const res = await api.get(`/api/blog/comment/${id}`);
      const ok = res?.data?.success ?? true;
      const list: BlogComment[] = res?.data?.comments || res?.data?.data || [];
      if (ok && Array.isArray(list)) setComments(list);
      else toast.error(res?.data?.message || "Failed to load comments");
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message || "Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      // Prefer add-comment; fallback to comment
      const res = await api.post(`/api/blog/add-comment`, {
        blogId: id,
        name,
        email,
        content: comment,
        comment,
      });
      const ok = res?.data?.success ?? true;
      if (!ok) {
        await api.post(`/api/blog/comment`, {
          blogId: id,
          name,
          email,
          content: comment,
          comment,
        });
      }
      setName("");
      setEmail("");
      setComment("");
      toast.success("Comment added (awaiting approval)");
      fetchComments();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message || "Failed to add comment");
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [id]); // eslint ok

  if (loading && !data) return <Loader />;

  return data ? (
    <Layout>
      <div className="bg-[#0f151b] text-[#e6eef7]">
        <section className="relative min-h-[84vh] border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0">
            {mediaSrc ? (
              data.video ? (
                <video src={mediaSrc} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : (
                <img src={mediaSrc} alt={data.title} className="w-full h-full object-cover" />
              )
            ) : (
              <img src={assets.gradientBackground} alt={data.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,20,0.18)_0%,rgba(10,15,20,0.74)_70%,rgba(10,15,20,0.96)_100%)]" />
          </div>

          <div className="relative z-10 max-w-[1250px] mx-auto px-4 sm:px-8 pt-28 pb-16 h-full flex flex-col justify-end">
            <div className="max-w-3xl reveal-up">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#abb9cb] mb-4">
                {data.category || "Residential"} · {data.createdAt ? dayjs(data.createdAt).format("YYYY") : "2026"}
              </p>
              <h1 className="architectural-heading text-[52px] sm:text-[84px] leading-[0.88] text-white">
                {data.title}
              </h1>
              {data.subTitle && (
                <p className="mt-4 text-sm sm:text-base text-[#c7d5e4] max-w-xl">{data.subTitle}</p>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-[1250px] mx-auto px-4 sm:px-8 py-14 sm:py-20">
          <div className="grid lg:grid-cols-[230px_1fr_240px] gap-10">
            <aside className="text-[#aebcd0] text-xs uppercase tracking-[0.09em] space-y-8">
              <div>
                <p className="text-[#6f7f94] mb-2">Credits</p>
                <p className="text-[#dde7f3]">Lead Architect</p>
                <p className="mt-1">Monolith Studio</p>
              </div>
              <div>
                <p className="text-[#6f7f94] mb-2">Timeline</p>
                <p>{data.createdAt ? dayjs(data.createdAt).format("YYYY") : "2026"} Project Commission</p>
                <p className="mt-1">+2 Years Delivery</p>
              </div>
            </aside>

            <div>
              <h2 className="architectural-heading text-[34px] sm:text-[52px] leading-[0.92] text-white mb-6">
                Reclaiming Industrial Ruins Through Geometric Rigor.
              </h2>
              {data.description && (
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              )}
            </div>

            <aside className="bg-[#dde3ea] text-[#111a23] p-6 h-fit">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#607086] mb-5">Technical Data</p>
              <p className="architectural-heading text-[32px] leading-none mb-5">1,450 m²</p>
              <p className="text-sm text-[#2b3745] leading-7">
                Glass, in-situ concrete, zinc cladding, and low-emissive glazing.
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] mt-6 text-[#607086]">Sustainability</p>
              <p className="text-sm mt-1">LEED Gold Certified</p>
            </aside>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <img
              src={mediaSrc || "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1300&auto=format&fit=crop"}
              alt="Project gallery"
              className="md:col-span-2 h-[240px] sm:h-[380px] w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=900&auto=format&fit=crop"
              alt="Project gallery"
              className="h-[240px] sm:h-[380px] w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=900&auto=format&fit=crop"
              alt="Project gallery"
              className="h-[240px] sm:h-[320px] w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1300&auto=format&fit=crop"
              alt="Project gallery"
              className="md:col-span-2 h-[240px] sm:h-[320px] w-full object-cover"
            />
          </div>

          <div className="mt-20 pt-12 border-t border-white/10 grid lg:grid-cols-[1fr_360px] gap-12">
            <div>
              <p className="architectural-heading text-[32px] text-white mb-6">Comments ({comments.filter((c) => c.isApproved !== false).length})</p>
              <div className="flex flex-col gap-4">
                {loadingComments ? (
                  <p className="text-sm text-[#9fb0c3]">Loading comments...</p>
                ) : comments.filter((c) => c.isApproved !== false).length ? (
                  comments
                    .filter((c) => c.isApproved !== false)
                    .map((item) => (
                      <div key={item._id} className="relative border border-white/12 bg-[#17212b] p-4 text-[#d4e2ef]">
                        <div className="flex items-center gap-2 mb-2">
                          <img src={assets.user_icon} alt="" className="w-6" />
                          <p className="font-medium">{item.name}</p>
                        </div>
                        <p className="text-sm leading-7">{item.content ?? item.comment}</p>
                        <div className="absolute right-4 bottom-4 text-xs text-[#8ca1b8]">
                          {dayjs(item.createdAt).fromNow()}
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-[#9fb0c3]">No comments yet.</p>
                )}
              </div>
            </div>

            <div>
              <p className="architectural-heading text-[32px] text-white mb-6">Add Comment</p>
              <form onSubmit={addComment} className="flex flex-col gap-4">
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Name"
                  required
                  className="h-11 px-4 bg-[#121b23] border border-white/15 text-[#e8f1fb] placeholder:text-[#7f92a9] outline-none"
                />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email (optional)"
                  className="h-11 px-4 bg-[#121b23] border border-white/15 text-[#e8f1fb] placeholder:text-[#7f92a9] outline-none"
                />
                <textarea
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  placeholder="Comment"
                  required
                  rows={6}
                  className="px-4 py-3 bg-[#121b23] border border-white/15 text-[#e8f1fb] placeholder:text-[#7f92a9] outline-none resize-none"
                />
                <button
                  type="submit"
                  className="h-11 px-8 bg-[#e7edf4] text-[#111b24] text-[11px] uppercase tracking-[0.12em] hover:bg-white transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <Link to="/portfolio" className="text-[#afc0d4] hover:text-white uppercase tracking-[0.1em] text-xs">
              Back to Portfolio
            </Link>
            <Link to="/contact" className="h-11 inline-flex items-center px-7 bg-[#e7edf4] text-[#111b24] text-[11px] uppercase tracking-[0.12em] hover:bg-white transition-colors">
              Schedule Consultation
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  ) : (
    <Loader />
  );
};

export default BlogDetail;
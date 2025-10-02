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
      <div className="relative">
        <img
          src={assets.gradientBackground}
          alt=""
          className="pointer-events-none select-none absolute -top-12 -z-10 opacity-50"
        />

        <section className="bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <p className="text-white/80 py-2 font-medium">
              Published on {data.createdAt ? dayjs(data.createdAt).format("MMMM D, YYYY") : "-"}
            </p>
            <h1 className="text-2xl sm:text-5xl font-semibold max-w-3xl mx-auto">{data.title}</h1>
            {data.subTitle && (
              <h2 className="my-5 max-w-xl truncate mx-auto text-white/80">{data.subTitle}</h2>
            )}
            <p className="inline-block py-1 px-4 rounded-full mb-2 border text-sm border-white/35 bg-white/10 font-medium">
              STUDIO 21 ARCHITECTS
            </p>
          </div>
        </section>

        <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
          {mediaSrc &&
            (data.video ? (
              <video src={mediaSrc} className="rounded-3xl mb-5 w-full aspect-video object-cover" controls />
            ) : (
              <img src={mediaSrc} alt={data.title} className="rounded-3xl mb-5 w-full aspect-video object-cover" />
            ))}

          {data.description && (
            <div
              className="rich-text max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          )}

          {/* Comments */}
          <div className="mt-14 mb-10 max-w-3xl mx-auto">
            <p className="font-semibold mb-4">
              Comments ({comments.filter((c) => c.isApproved !== false).length})
            </p>

            <div className="flex flex-col gap-4">
              {loadingComments ? (
                <p className="text-sm text-gray-500">Loading comments…</p>
              ) : comments.filter((c) => c.isApproved !== false).length ? (
                comments
                  .filter((c) => c.isApproved !== false)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="relative bg-primary/5 border border-primary/20 max-w-xl p-4 rounded text-gray-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <img src={assets.user_icon} alt="" className="w-6" />
                        <p className="font-medium">{item.name}</p>
                      </div>
                      <p className="text-sm max-w-md ml-8">{item.content ?? item.comment}</p>
                      <div className="absolute right-4 bottom-3 text-xs text-gray-500">
                        {dayjs(item.createdAt).fromNow()}
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>
          </div>

          {/* Comment form */}
          <div className="max-w-3xl mx-auto">
            <p className="font-semibold mb-4">Add your Comment</p>
            <form onSubmit={addComment} className="flex flex-col items-start gap-4 max-w-lg">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Name"
                required
                className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email (optional)"
                className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <textarea
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                placeholder="Comment"
                required
                rows={5}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-accent text-white p-2 px-8 rounded hover:brightness-110 transition-all cursor-pointer"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="max-w-3xl mx-auto mt-10 flex items-center justify-between">
            <Link to="/portfolio" className="underline underline-offset-4">
              ← Back to Portfolio
            </Link>
            <Link to="/contact" className="rounded-md bg-accent text-white px-4 py-2 hover:brightness-110">
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <Loader />
  );
};

export default BlogDetail;
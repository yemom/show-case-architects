import React from "react";
import Layout from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "@/context/useAppContext";
import { getMediaUrl } from "@/lib/util";
// no ui primitives needed here

type Blog = {
  _id: string;
  title: string;
  subTitle: string;
  category: string;
  description: string;
  image?: string | null;
  video?: string | null;
  createdAt: string;
};

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [blog, setBlog] = React.useState<Blog | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        if (!id) {
          setBlog(null);
          return;
        }
        const { data } = await axios.get(`/api/blog/${id}`);
        setBlog(data?.blog || null);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [axios, id]);

  return (
    <Layout>
      <div>
        <section className="py-12 bg-architectural-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link to="/portfolio" className="text-sm text-accent">← Back to Portfolio</Link>
            </div>
            {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {!loading && !blog && <p className="text-sm text-muted-foreground">Not found.</p>}
            {blog && (
              <article className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-light">{blog.title}</h1>
                <div className="text-sm text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</div>
                <div className="rounded-lg overflow-hidden">
                  {blog.video ? (
                    <video
                      src={getMediaUrl(blog.video, axios.defaults.baseURL) || ''}
                      className="w-full aspect-video object-cover"
                      controls
                      onError={(e) => {
                        const el = e.currentTarget as HTMLVideoElement;
                        if (el.src.includes('/uploads/videos/')) el.src = el.src.replace('/uploads/videos/', '/uploads/');
                      }}
                    />
                  ) : (
                    <img
                      src={getMediaUrl(blog.image, axios.defaults.baseURL) || ''}
                      alt={blog.title}
                      className="w-full aspect-video object-cover"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        if (el.src.includes('/uploads/images/')) el.src = el.src.replace('/uploads/images/', '/uploads/');
                      }}
                    />
                  )}
                </div>
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: blog.description }} />
              </article>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BlogDetail;
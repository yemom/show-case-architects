import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

type Blog = {
  _id: string;
  title: string;
  createdAt: string | Date;
  isPublished?: boolean;
};

type Props = {
  blog: Blog;
  fetchBlogs: () => Promise<void> | void;
  index: number;
};

const BlogTable: React.FC<Props> = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const deleteBlog = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this blog?');
    if (!isConfirmed) return;
    try {
      const { data } = await axios.delete('/api/blog/delete', { data: { id: blog._id } });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      const message = getAxiosErrorMessage(error) || 'Failed to delete blog';
      toast.error(message);
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/api/blog/toggle-publish', { id: blog._id });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      const message = getAxiosErrorMessage(error) || 'Failed to toggle publish status';
      toast.error(message);
    }
  };

  function getAxiosErrorMessage(err: unknown): string | undefined {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const anyErr = err as { response?: { data?: { message?: string } } };
      return anyErr.response?.data?.message;
    }
    return undefined;
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group border-b border-[#a9bacd]/35 bg-[#f4f7fb] hover:bg-[#dde5ee] transition-colors"
    >
      <th className="px-3 py-3 text-[#5f6f80]">{index}</th>
      <td className="px-3 py-3 text-[#1a2329]">{title}</td>
      <td className="px-3 py-3 max-sm:hidden text-[#5f6f80]">{BlogDate.toLocaleDateString()}</td>
      <td className="px-3 py-3 max-sm:hidden">
        <p className={blog.isPublished ? 'text-emerald-700' : 'text-amber-700'}>
          {blog.isPublished ? 'published' : 'unpublished'}
        </p>
      </td>
      <td className="px-3 py-3">
        <div className="flex text-xs gap-3">
          <button
            onClick={togglePublish}
            className="border border-[#b86f4e]/55 px-2 py-1 mt-0.5 text-[#7d442f] hover:bg-[#b86f4e]/12 transition-colors cursor-pointer"
          >
            {blog.isPublished ? 'unpublish' : 'publish'}
          </button>
          <img
            src={assets.cross_icon}
            className="w-6 hover:scale-110 transition-transform cursor-pointer"
            onClick={deleteBlog}
            alt="delete"
          />
        </div>
      </td>
    </motion.tr>
  );
};

export default BlogTable;

import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

type BlogRef = { title: string };
type Comment = {
  _id: string;
  blog: BlogRef;
  createdAt: string | Date;
  name: string;
  content: string;
  isApproved?: boolean;
};

type Props = {
  comment: Comment;
  fetchComments: () => Promise<void> | void;
};

const CommentTable: React.FC<Props> = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const { axios } = useAppContext();
  const BlogDate = new Date(createdAt);

  const onApprove = async () => {
    try {
      const { data } = await axios.post('/api/admin/approved-comment', { id: _id });
      if (data.success) {
        toast.success('Comment approved');
        fetchComments();
      } else {
        toast.error(data.message || 'Failed to approve');
      }
    } catch (error: unknown) {
      const message =
        (typeof error === 'object' && error && 'response' in error &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).response?.data?.message) || 'Failed to approve';
      toast.error(message);
    }
  };

  const onDelete = async () => {
    try {
      const { data } = await axios.post('/api/admin/delete-comment', { id: _id });
      if (data.success) {
        toast.success('Comment deleted');
        fetchComments();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error: unknown) {
      const message =
        (typeof error === 'object' && error && 'response' in error &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any).response?.data?.message) || 'Failed to delete';
      toast.error(message);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="border-b border-[#a9bacd]/35 bg-[#f4f7fb] hover:bg-[#dde5ee] transition-colors"
    >
      <td className="px-4 py-3 text-[#1a2329]">
        <b className="font-medium text-[#5f6f80]">Blog</b> : {blog.title}
        <br />
        <br />
        <b className="font-medium text-[#5f6f80]">Name</b> : {comment.name}
        <br />
        <b className="font-medium text-[#5f6f80]">Comment</b> : {comment.content}
      </td>
      <td className="px-4 py-3 max-sm:hidden text-[#5f6f80]">
        {BlogDate.toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <img
              onClick={onApprove}
              src={assets.tick_icon}
              className="w-5 hover:scale-110 transition-transform cursor-pointer drop-shadow"
              alt="approve"
            />
          ) : (
            <p className="text-xs border border-emerald-600/45 bg-emerald-500/12 text-emerald-700 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
            onClick={onDelete}
            src={assets.bin_icon}
            alt="delete"
            className="w-5 hover:scale-110 transition-transform cursor-pointer drop-shadow"
          />
        </div>
      </td>
    </motion.tr>
  );
};

export default CommentTable;

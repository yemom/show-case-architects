import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

const CommentTable = ({ comment, fetchComments }) => {
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
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve');
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
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };
    return (
        <motion.tr
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className='border-y border-gray-300 bg-white/60 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden'
        >
            <td className='px-6 py-4'>
                <b className='font-medium text-gray-600'>Blog</b> : {blog.title}
                <br />
                <br />
                <b className='font-medium text-gray-600'>Name</b> : {comment.name}
                <br />
                <b className='font-medium text-gray-600'>Comment</b> : {comment.content}
            </td>
            <td className='px-6 py-4 max-sm:hidden'>
                 {BlogDate.toLocaleDateString()}
                <b className='font-medium text-gray-600'>Comment</b> : {comment.comment}
            </td>
            <td className='px-6 py-4 '>
                <div className='inline-flex items-center gap-4'>
                    {!comment.isApproved ?
                        <img onClick={onApprove} src={assets.tick_icon} className='w-5 hover:scale-110 transition-transform cursor-pointer drop-shadow' /> : <p className='text-xs border 
                border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1 shadow-sm'>Approved</p>
                    }
                    <img onClick={onDelete} src={assets.bin_icon} alt='' className='w-5 hover:scale-110 transition-transform cursor-pointer drop-shadow'/>
                </div>
            </td>
        </motion.tr>
    )
}

export default CommentTable

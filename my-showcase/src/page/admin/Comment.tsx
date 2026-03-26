import React, { useCallback, useEffect, useState } from 'react';
import CommentTable from '../../components/admin/CommentTable';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

type CommentType = {
    _id: string;
    isApproved?: boolean;
    createdAt: string;
    blog: { title: string };
    name: string;
    content: string;
};

const Comment: React.FC = () => {
    const [Comments, setComments] = useState<CommentType[]>([]);
    const [filter, setFilter] = useState<'Approved' | 'Not Approved'>('Not Approved');
    const { axios, token } = useAppContext();

    const fetchComments = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/admin/comment', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (data.success) {
                setComments(data.comments);
            } else {
                toast.error(data.message || 'Failed to fetch comments');
            }
        } catch (error: unknown) {
            const message =
                (typeof error === 'object' && error && 'response' in error &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (error as any).response?.data?.message) || 'Failed to fetch comments';
            toast.error(message);
        }
    }, [axios, token]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return (
        <div className='p-4 sm:p-6 lg:p-8 text-[#e4edf6]'>
            <div className='max-w-[1320px] mx-auto'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4'>
                    <div>
                        <p className='text-[10px] uppercase tracking-[0.2em] text-[#90a5ba]'>Community</p>
                        <h1 className='architectural-heading text-[42px] sm:text-[60px] leading-[0.9] mt-2'>Comments</h1>
                    </div>
                <div className='flex gap-4'>
                    <button onClick={() => setFilter('Approved')} className={`border px-4 py-2 cursor-pointer text-[11px] uppercase tracking-[0.12em] ${filter === 'Approved' ? 'border-[#b86f4e]/55 bg-[#b86f4e]/20 text-[#f2d8cb]' : 'border-white/20 text-[#a8bbcf]'}`}>
                        Approved
                    </button>
                    <button onClick={() => setFilter('Not Approved')} className={`border px-4 py-2 cursor-pointer text-[11px] uppercase tracking-[0.12em] ${filter === 'Not Approved' ? 'border-[#b86f4e]/55 bg-[#b86f4e]/20 text-[#f2d8cb]' : 'border-white/20 text-[#a8bbcf]'}`}>
                        Not Approved
                    </button>
                </div>
            </div>

            <div className='overflow-x-auto mt-5 border border-white/12 bg-[#121a22]'>
                <table className='w-full text-sm'>
                    <thead className='text-[10px] text-[#93a9bf] uppercase tracking-[0.1em] text-left border-b border-white/10'>
                        <tr>
                            <th scope='col' className='px-4 py-3'>Post Title & Comment</th>
                            <th scope='col' className='px-4 py-3'>Date</th>
                            <th scope='col' className='px-4 py-3'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Comments.filter((comment) => (filter === 'Approved' ? comment.isApproved === true : comment.isApproved !== true)).map((comment) => (
                            <CommentTable key={comment._id} comment={comment} fetchComments={fetchComments} />
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
};

export default Comment;

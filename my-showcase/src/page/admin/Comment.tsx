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
                toast.error(data.message || 'We could not load comments right now. Please try again.');
            }
        } catch (error: unknown) {
            const message =
                (typeof error === 'object' && error && 'response' in error &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (error as any).response?.data?.message) || 'We could not load comments right now. Please try again.';
            toast.error(message);
        }
    }, [axios, token]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return (
        <div className='p-4 sm:p-6 lg:p-8 text-[#17212b]'>
            <div className='max-w-[1320px] mx-auto'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4'>
                    <div>
                        <p className='text-[10px] uppercase tracking-[0.2em] text-[#637081]'>Community</p>
                        <h1 className='architectural-heading text-[42px] sm:text-[60px] leading-[0.9] mt-2 text-[#1a2329]'>Comments</h1>
                    </div>
                <div className='flex gap-4'>
                    <button onClick={() => setFilter('Approved')} className={`border px-4 py-2 cursor-pointer text-[11px] uppercase tracking-[0.12em] ${filter === 'Approved' ? 'border-[#b86f4e]/60 bg-[#b86f4e]/15 text-[#7d442f]' : 'border-[#a9bacd]/60 text-[#637081] bg-[#f4f7fb]'}`}>
                        Approved
                    </button>
                    <button onClick={() => setFilter('Not Approved')} className={`border px-4 py-2 cursor-pointer text-[11px] uppercase tracking-[0.12em] ${filter === 'Not Approved' ? 'border-[#b86f4e]/60 bg-[#b86f4e]/15 text-[#7d442f]' : 'border-[#a9bacd]/60 text-[#637081] bg-[#f4f7fb]'}`}>
                        Not Approved
                    </button>
                </div>
            </div>

            <div className='overflow-x-auto mt-5 border border-[#a9bacd]/50 bg-[#eaf0f6]'>
                <table className='w-full text-sm'>
                    <thead className='bg-[#edf3f9] text-[9px] font-semibold text-[#5f6f80] uppercase tracking-[0.16em] text-left border-b border-[#a9bacd]/50'>
                        <tr>
                            <th scope='col' className='px-4 py-2.5'>Post Title & Comment</th>
                            <th scope='col' className='px-4 py-2.5'>Date</th>
                            <th scope='col' className='px-4 py-2.5'>Status</th>
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

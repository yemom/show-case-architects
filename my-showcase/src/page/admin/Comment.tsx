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
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-architectural-light'>
            <div className='flex justify-between items-center max-w-3xl'>
                <h1>Comments</h1>
                <div className='flex gap-4'>
                    <button onClick={() => setFilter('Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Approved' ? 'text-primary' : ' text-gray-700'}`}>
                        Approved
                    </button>
                    <button onClick={() => setFilter('Not Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Not Approved' ? 'text-primary' : ' text-gray-700'}`}>
                        Not Approved
                    </button>
                </div>
            </div>
            <div className='relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide '>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-gray-600 uppercase text-left'>
                        <tr>
                            <th scope='col' className='px-2 py-4'>Post Title & Comment</th>
                            <th scope='col' className='px-2 py-4'>Date</th>
                            <th scope='col' className='px-2 py-4'>Status</th>
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
    );
};

export default Comment;

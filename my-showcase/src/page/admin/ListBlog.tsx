import React, { useState, useEffect, useCallback } from 'react';
import BlogTable from '../../components/admin/BlogTable';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

type Blog = { _id: string; title: string; createdAt: string; isPublished?: boolean; category?: string };

const ListBlog: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const { axios, token } = useAppContext();

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/admin/blogs', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (data.success) {
                setBlogs(data.blogs);
            } else {
                toast.error(data.message || 'Failed to fetch blogs');
            }
        } catch (error: unknown) {
            const message =
                (typeof error === 'object' && error && 'response' in error &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (error as any).response?.data?.message) || 'Failed to fetch blogs';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [axios, token]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return (
        <div className='flex-1 py-5 px-5 sm:pt-12 md:p-16 bg-architectural-light'>
            <h1 className='mb-4 text-xl font-semibold'>All Post</h1>
            <div className='relative h-4/5 max-w-6xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-gray-600 uppercase text-left bg-gray-100'>
                        <tr>
                            <th className='px-2 py-3'>#</th>
                            <th className='px-2 py-3'>Title</th>
                            <th className='px-2 py-3 max-sm:hidden'>Date</th>
                            <th className='px-2 py-3 max-sm:hidden'>Status</th>
                            <th className='px-2 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-gray-500'>Loading post...</td>
                            </tr>
                        ) : blogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-gray-500'>No post found</td>
                            </tr>
                        ) : (
                            blogs.map((blog, index) => (
                                <BlogTable key={blog._id} blog={blog} index={index + 1} fetchBlogs={fetchBlogs} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListBlog;

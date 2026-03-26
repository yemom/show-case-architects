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
        <div className='p-4 sm:p-6 lg:p-8 text-[#e4edf6]'>
            <div className='max-w-[1320px] mx-auto'>
                <div className='mb-4'>
                    <p className='text-[10px] uppercase tracking-[0.2em] text-[#90a5ba]'>Content Library</p>
                    <h1 className='architectural-heading text-[42px] sm:text-[60px] leading-[0.9] mt-2'>All Projects</h1>
                </div>

                <div className='overflow-x-auto border border-white/12 bg-[#121a22]'>
                    <table className='w-full text-sm'>
                        <thead className='text-[10px] text-[#93a9bf] uppercase tracking-[0.1em] text-left border-b border-white/10'>
                        <tr>
                            <th className='px-3 py-3'>#</th>
                            <th className='px-3 py-3'>Title</th>
                            <th className='px-3 py-3 max-sm:hidden'>Date</th>
                            <th className='px-3 py-3 max-sm:hidden'>Status</th>
                            <th className='px-3 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-[#8ea3b8]'>Loading post...</td>
                            </tr>
                        ) : blogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-[#8ea3b8]'>No post found</td>
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
        </div>
    );
};

export default ListBlog;

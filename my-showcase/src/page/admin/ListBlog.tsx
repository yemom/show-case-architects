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
        <div className='p-4 sm:p-6 lg:p-8 text-[#17212b]'>
            <div className='max-w-[1320px] mx-auto'>
                <div className='mb-4'>
                    <p className='text-[10px] uppercase tracking-[0.2em] text-[#637081]'>Content Library</p>
                    <h1 className='architectural-heading text-[42px] sm:text-[60px] leading-[0.9] mt-2 text-[#1a2329]'>All Projects</h1>
                </div>

                <div className='overflow-x-auto border border-[#a9bacd]/50 bg-[#eaf0f6]'>
                    <table className='w-full text-sm'>
                        <thead className='bg-[#edf3f9] text-[9px] font-semibold text-[#5f6f80] uppercase tracking-[0.16em] text-left border-b border-[#a9bacd]/50'>
                        <tr>
                            <th className='px-3 py-2.5'>#</th>
                            <th className='px-3 py-2.5'>Title</th>
                            <th className='px-3 py-2.5 max-sm:hidden'>Date</th>
                            <th className='px-3 py-2.5 max-sm:hidden'>Status</th>
                            <th className='px-3 py-2.5'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-[#637081]'>Loading post...</td>
                            </tr>
                        ) : blogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-[#637081]'>No post found</td>
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

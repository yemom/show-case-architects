import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/useAppContext';
import { assets } from '../../assets/assets';
import BlogTable from '../../components/admin/BlogTable';

type DashboardData = {
    blogs?: number;
    comments?: number;
    drafts?: number;
    recentBlogs?: Array<{ _id: string; title: string; createdAt: string; isPublished?: boolean }>;
};

const Dashboard: React.FC = () => {
    const { axios, token, setToken } = useAppContext();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common.Authorization;
        }
    }, [token, axios]);

    const fetchDashboardData = useCallback(async () => {
        if (!token) {
            navigate('/admin');
            toast.error('Please login to access admin panel');
            return;
        }
        try {
            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setDashboardData(data.dashboardData);
            } else {
                toast.error(data.message || 'Failed to fetch dashboard data');
            }
        } catch (error: unknown) {
            const status = (typeof error === 'object' && error && 'response' in error)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (error as any).response?.status
                : undefined;
            if (status === 401) {
                toast.error('Session expired. Please login again.');
                setToken('');
                navigate('/admin');
            } else {
                const message = (typeof error === 'object' && error && 'response' in error)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ? (error as any).response?.data?.message
                    : undefined;
                toast.error(message || 'Failed to fetch dashboard data');
            }
        }
    }, [axios, token, navigate, setToken]);

    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchDashboardData();
        }
    }, [fetchDashboardData]);

    // const refresh = () => fetchDashboardData(); // currently unused

    return (
        <div className='flex-1 p-1 md:p-10 bg-architectural-light'>
            <div className='flex flex-wrap gap-4'>
                <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-205 transition-all'>
                    <img src={assets.dashboard_icon_1} alt='' />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashboardData?.blogs}</p>
                        <p className='text-gray-400 font-light'>Post</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-205 transition-all'>
                    <img src={assets.dashboard_icon_2} alt='' />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashboardData?.comments}</p>
                        <p className='text-gray-400 font-light'>comments</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-205 transition-all'>
                    <img src={assets.dashboard_icon_3} alt='' />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashboardData?.drafts}</p>
                        <p className='text-gray-400 font-light'>Drafts</p>
                    </div>
                </div>
            </div>

            <div className='flex items-center gap--3 m-4 mt-6 text-gray-600'>
                <img src={assets.dashboard_icon_4} alt='' />
                <p className='text-lg font-semibold'>Recent Post</p>
            </div>
            <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
                <table className='w-full text-sm text-gray-500'>
                    <thead className='text-xs text-gray-600 uppercase text-left'>
                        <tr>
                            <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
                            <th scope='col' className='px-2 py-4'> PostTitle</th>
                            <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
                            <th scope='col' className='px-2 py-4 max-sm:hidden'>Status</th>
                            <th scope='col' className='px-2 py-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData?.recentBlogs?.map((blog, index) => (
                            <BlogTable key={blog._id} blog={blog} fetchBlogs={fetchDashboardData} index={index + 1} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;

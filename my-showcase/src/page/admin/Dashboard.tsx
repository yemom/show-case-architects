import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BarChart3, Activity, CalendarClock, Sparkles, FolderKanban } from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
} from 'recharts';
import { useAppContext } from '../../context/useAppContext';
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
    const [adminName, setAdminName] = useState('Admin');
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
            toast.error('Please sign in to access the admin dashboard.');
            return;
        }
        try {
            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setDashboardData(data.dashboardData);
            } else {
                toast.error(data.message || 'We could not load dashboard data right now.');
            }
        } catch (error: unknown) {
            const status = (typeof error === 'object' && error && 'response' in error)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (error as any).response?.status
                : undefined;
            if (status === 401) {
                toast.error('Your session has expired. Please sign in again.');
                setToken('');
                navigate('/admin');
            } else {
                const message = (typeof error === 'object' && error && 'response' in error)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ? (error as any).response?.data?.message
                    : undefined;
                toast.error(message || 'We could not load dashboard data right now.');
            }
        }
    }, [axios, token, navigate, setToken]);

    const fetchCurrentAdmin = useCallback(async () => {
        if (!token) return;
        try {
            const { data } = await axios.get('/api/admin/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data?.success && data?.admin?.displayName) {
                setAdminName(String(data.admin.displayName));
            }
        } catch {
            // Keep UI resilient with default value if identity lookup fails.
        }
    }, [axios, token]);

    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchDashboardData();
        }
    }, [fetchDashboardData]);

    useEffect(() => {
        fetchCurrentAdmin();
    }, [fetchCurrentAdmin]);

    const activitySeries = React.useMemo(() => {
        const blogs = dashboardData?.blogs ?? 0;
        const comments = dashboardData?.comments ?? 0;
        return [
            { month: 'Jan', velocity: Math.max(2, Math.round(blogs * 0.25)), engagement: Math.max(4, Math.round(comments * 0.3)) },
            { month: 'Feb', velocity: Math.max(3, Math.round(blogs * 0.35)), engagement: Math.max(6, Math.round(comments * 0.4)) },
            { month: 'Mar', velocity: Math.max(4, Math.round(blogs * 0.45)), engagement: Math.max(7, Math.round(comments * 0.46)) },
            { month: 'Apr', velocity: Math.max(5, Math.round(blogs * 0.58)), engagement: Math.max(8, Math.round(comments * 0.56)) },
            { month: 'May', velocity: Math.max(6, Math.round(blogs * 0.72)), engagement: Math.max(9, Math.round(comments * 0.64)) },
            { month: 'Jun', velocity: Math.max(7, Math.round(blogs * 0.85)), engagement: Math.max(10, Math.round(comments * 0.75)) },
            { month: 'Jul', velocity: Math.max(8, Math.round(blogs * 0.96)), engagement: Math.max(11, Math.round(comments * 0.9)) },
        ];
    }, [dashboardData?.blogs, dashboardData?.comments]);

    const distributionData = React.useMemo(() => {
        const blogs = dashboardData?.blogs ?? 0;
        const drafts = dashboardData?.drafts ?? 0;
        const comments = dashboardData?.comments ?? 0;
        return [
            { name: 'Published', value: Math.max(1, blogs - drafts) },
            { name: 'Drafts', value: Math.max(1, drafts) },
            { name: 'Comments', value: Math.max(1, comments) },
        ];
    }, [dashboardData?.blogs, dashboardData?.drafts, dashboardData?.comments]);

    const chartColors = ['#b86f4e', '#5a80ab', '#8fa7bf'];

    return (
        <div className='p-4 sm:p-6 lg:p-7 text-[#17212b]'>
            <div className='max-w-[1360px] mx-auto space-y-5'>
                <section className='grid lg:grid-cols-[2.35fr_0.95fr] gap-4'>
                    <div className='border border-[#a9bacd]/50 bg-[#eaf0f6] p-5 sm:p-6'>
                        <p className='text-[10px] uppercase tracking-[0.18em] text-[#7a8a9c]'>Welcome, {adminName}</p>
                        <p className='text-[10px] uppercase tracking-[0.2em] text-[#637081]'>Design Intelligence</p>
                        <h1 className='architectural-heading mt-3 text-[42px] sm:text-[68px] leading-[0.88] text-[#1a2329]'>Total Portfolio Reach</h1>
                        <p className='text-[#4f5f71] mt-3 max-w-2xl'>Live project pipeline and resource allocation overview for studio operations.</p>

                        <div className='mt-5 grid sm:grid-cols-3 gap-2.5'>
                            <div className='border border-[#a9bacd]/45 bg-[#f4f7fb] p-4'>
                                <p className='text-[10px] uppercase tracking-[0.14em] text-[#637081]'>Total Projects</p>
                                <p className='architectural-heading text-[34px] mt-1 text-[#1a2329]'>{dashboardData?.blogs ?? 0}</p>
                            </div>
                            <div className='border border-[#a9bacd]/45 bg-[#f4f7fb] p-4'>
                                <p className='text-[10px] uppercase tracking-[0.14em] text-[#637081]'>Comments</p>
                                <p className='architectural-heading text-[34px] mt-1 text-[#1a2329]'>{dashboardData?.comments ?? 0}</p>
                            </div>
                            <div className='border border-[#a9bacd]/45 bg-[#f4f7fb] p-4'>
                                <p className='text-[10px] uppercase tracking-[0.14em] text-[#637081]'>Drafts</p>
                                <p className='architectural-heading text-[34px] mt-1 text-[#1a2329]'>{dashboardData?.drafts ?? 0}</p>
                            </div>
                        </div>

                        <div className='mt-4 border border-[#a9bacd]/45 bg-[#f4f7fb] p-4'>
                            <div className='flex items-center justify-between mb-3'>
                                <p className='text-[10px] uppercase tracking-[0.14em] text-[#637081]'>Development Velocity</p>
                                <p className='text-[10px] uppercase tracking-[0.14em] text-[#4f5f71]'>Weekly</p>
                            </div>
                            <div className='h-44'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <AreaChart data={activitySeries}>
                                        <defs>
                                            <linearGradient id='velocityFill' x1='0' y1='0' x2='0' y2='1'>
                                                <stop offset='5%' stopColor='#b86f4e' stopOpacity={0.58} />
                                                <stop offset='95%' stopColor='#b86f4e' stopOpacity={0.06} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke='rgba(26,35,41,0.12)' vertical={false} />
                                        <XAxis dataKey='month' stroke='#637081' tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <YAxis stroke='#637081' tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                                        <Tooltip
                                            contentStyle={{ background: '#f4f7fb', border: '1px solid rgba(26,35,41,0.18)', color: '#1a2329' }}
                                            labelStyle={{ color: '#1a2329' }}
                                        />
                                        <Area type='monotone' dataKey='velocity' stroke='#d28460' fill='url(#velocityFill)' strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className='border border-[#d5967a]/55 bg-[#b86f4e] p-5 sm:p-6 text-white'>
                        <p className='text-[10px] uppercase tracking-[0.2em] text-[#f5d9cd]'>Activity Focus</p>
                        <div className='mt-4 space-y-4'>
                            <div className='flex items-start gap-3'>
                                <BarChart3 className='w-4 h-4 mt-1' />
                                <p className='text-sm leading-7'>Current strategy emphasizes engagement growth and publishing cadence optimization.</p>
                            </div>
                            <div className='flex items-start gap-3'>
                                <CalendarClock className='w-4 h-4 mt-1' />
                                <p className='text-sm leading-7'>3 milestones in the upcoming week require content and review alignment.</p>
                            </div>
                        </div>

                        <div className='mt-5 h-44 border border-white/30 bg-[#9f5f42] p-2'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart data={activitySeries}>
                                    <XAxis dataKey='month' stroke='#f3d8ca' tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke='#f3d8ca' tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                                    <Tooltip contentStyle={{ background: '#6f3f2b', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }} />
                                    <Bar dataKey='engagement' fill='#f1d5c7' radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                <section className='grid xl:grid-cols-[1.72fr_0.98fr] gap-4'>
                    <div className='border border-[#a9bacd]/50 bg-[#eaf0f6] p-5 sm:p-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-2'>
                                <Activity className='w-4 h-4 text-[#5a80ab]' />
                                <p className='text-[11px] uppercase tracking-[0.14em] text-[#637081]'>Recent Projects</p>
                            </div>
                            <Sparkles className='w-4 h-4 text-[#5a80ab]' />
                        </div>
                        <div className='overflow-x-auto border border-[#a9bacd]/45 bg-[#f4f7fb]'>
                            <table className='w-full text-sm'>
                                <thead className='bg-[#edf3f9] text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5f6f80] border-b border-[#a9bacd]/50'>
                                    <tr>
                                        <th scope='col' className='px-3 py-2.5 text-left'>#</th>
                                        <th scope='col' className='px-3 py-2.5 text-left'>Title</th>
                                        <th scope='col' className='px-3 py-2.5 max-sm:hidden text-left'>Date</th>
                                        <th scope='col' className='px-3 py-2.5 max-sm:hidden text-left'>Status</th>
                                        <th scope='col' className='px-3 py-2.5 text-left'>Actions</th>
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

                    <div className='grid sm:grid-cols-2 xl:grid-cols-1 gap-4'>
                        <article className='border border-[#a9bacd]/50 bg-[#eaf0f6] p-5'>
                            <div className='flex items-center gap-2'>
                                <FolderKanban className='w-4 h-4 text-[#5a80ab]' />
                                <p className='text-[11px] uppercase tracking-[0.14em] text-[#637081]'>Current Engagements</p>
                            </div>
                            <div className='mt-4 grid grid-cols-2 gap-2.5'>
                                <img src='https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop' alt='preview' className='h-[88px] w-full object-cover border border-[#a9bacd]/45' />
                                <img src='https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1200&auto=format&fit=crop' alt='preview' className='h-[88px] w-full object-cover border border-[#a9bacd]/45' />
                                <img src='https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop' alt='preview' className='h-[88px] w-full object-cover border border-[#a9bacd]/45' />
                                <img src='https://images.unsplash.com/photo-1529429612779-c8e40ef2f36d?q=80&w=1200&auto=format&fit=crop' alt='preview' className='h-[88px] w-full object-cover border border-[#a9bacd]/45' />
                            </div>
                        </article>

                        <article className='border border-[#a9bacd]/50 bg-[#f4f7fb] p-5'>
                            <p className='text-[10px] uppercase tracking-[0.16em] text-[#637081]'>Project Completion</p>
                            <div className='mt-2 h-32'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <PieChart>
                                        <Pie data={distributionData} dataKey='value' cx='50%' cy='50%' innerRadius={34} outerRadius={56} paddingAngle={3}>
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${entry.name}`} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#f4f7fb', border: '1px solid rgba(26,35,41,0.18)', color: '#1a2329' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <p className='text-sm text-[#4f5f71] mt-2'>Distribution of published content, drafts, and engagement volume.</p>
                        </article>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;

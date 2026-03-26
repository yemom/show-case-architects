import React, { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../../context/useAppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Admin = { _id: string; email: string; role: string; isApproved?: boolean };

const AdminRequests: React.FC = () => {
    const { axios, token, userRole } = useAppContext();
    const navigate = useNavigate();
    const [admins, setAdmins] = useState<Admin[]>([]);

    const fetchAdmins = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/admin/admins', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (data.success) setAdmins(data.admins);
            else toast.error(data.message || 'Failed to fetch admins');
        } catch (err: unknown) {
            const message =
                (typeof err === 'object' && err && 'response' in err &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err as any).response?.data?.message) || 'Failed to fetch admins';
            toast.error(message);
        }
    }, [axios, token]);

    const onApprove = async (id: string) => {
        try {
            const { data } = await axios.post(
                '/api/admin/approve-admin',
                { id },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            if (data.success) {
                toast.success('Admin approved');
                fetchAdmins();
            } else toast.error(data.message || 'Approve failed');
        } catch (err: unknown) {
            const message =
                (typeof err === 'object' && err && 'response' in err &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err as any).response?.data?.message) || 'Approve failed';
            toast.error(message);
        }
    };

    const onDelete = async (id: string) => {
        try {
            if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;
            const { data } = await axios.post(
                '/api/admin/delete-admin',
                { id },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            if (data.success) {
                toast.success('Admin deleted');
                fetchAdmins();
            } else toast.error(data.message || 'Delete failed');
        } catch (err: unknown) {
            const message =
                (typeof err === 'object' && err && 'response' in err &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err as any).response?.data?.message) || 'Delete failed';
            toast.error(message);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error('Please login as a super admin');
            navigate('/admin');
            return;
        }
        if (userRole !== 'super') {
            toast.error('Forbidden: Super admin access only');
            navigate('/admin');
            return;
        }
        fetchAdmins();
    }, [fetchAdmins, token, userRole, navigate]);

    return (
        <div className='p-4 sm:p-6 lg:p-8 text-[#17212b]'>
            <div className='max-w-[1200px] mx-auto'>
                <div className='mb-4'>
                    <p className='text-[10px] uppercase tracking-[0.2em] text-[#637081]'>Governance</p>
                    <h1 className='architectural-heading text-[42px] sm:text-[60px] leading-[0.9] mt-2 text-[#1a2329]'>Admin Requests</h1>
                </div>
                <div className='overflow-x-auto border border-[#a9bacd]/50 bg-[#eaf0f6]'>
                    <table className='w-full text-sm'>
                        <thead className='bg-[#edf3f9] text-left text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5f6f80] border-b border-[#a9bacd]/50'>
                        <tr>
                            <th className='px-4 py-2.5'>Email</th>
                            <th className='px-4 py-2.5'>Role</th>
                            <th className='px-4 py-2.5'>Status</th>
                            <th className='px-4 py-2.5'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((a) => (
                            <tr key={a._id} className='border-t border-[#a9bacd]/35 bg-[#f4f7fb] hover:bg-[#dde5ee] transition-colors'>
                                <td className='px-4 py-3 text-[#1a2329]'>{a.email}</td>
                                <td className='px-4 py-3 text-[#5f6f80]'>{a.role}</td>
                                <td className='px-4 py-3 text-[#5f6f80]'>{a.isApproved ? 'Approved' : 'Pending'}</td>
                                <td className='px-4 py-3 space-x-2'>
                                    {!a.isApproved && (
                                        <button onClick={() => onApprove(a._id)} className='px-3 py-1 text-xs border border-emerald-600/55 bg-emerald-500/12 text-emerald-700'>Approve</button>
                                    )}
                                    {a.role !== 'super' && (
                                        <button onClick={() => onDelete(a._id)} className='px-3 py-1 text-xs border border-[#b86f4e]/70 bg-[#b86f4e]/12 text-[#7d442f]'>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

export default AdminRequests;

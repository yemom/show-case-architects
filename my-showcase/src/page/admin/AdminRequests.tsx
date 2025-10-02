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
        <div className='flex-1 p-4 md:p-10 bg-architectural-light'>
            <h1 className='text-xl font-semibold mb-4'>Admin Requests</h1>
            <div className='bg-white rounded shadow overflow-x-auto max-w-3xl'>
                <table className='w-full text-sm'>
                    <thead className='text-left text-gray-600'>
                        <tr>
                            <th className='px-4 py-3'>Email</th>
                            <th className='px-4 py-3'>Role</th>
                            <th className='px-4 py-3'>Status</th>
                            <th className='px-4 py-3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((a) => (
                            <tr key={a._id} className='border-t'>
                                <td className='px-4 py-3'>{a.email}</td>
                                <td className='px-4 py-3'>{a.role}</td>
                                <td className='px-4 py-3'>{a.isApproved ? 'Approved' : 'Pending'}</td>
                                <td className='px-4 py-3 space-x-2'>
                                    {!a.isApproved && (
                                        <button onClick={() => onApprove(a._id)} className='px-3 py-1 text-xs bg-primary text-white rounded'>Approve</button>
                                    )}
                                    {a.role !== 'super' && (
                                        <button onClick={() => onDelete(a._id)} className='px-3 py-1 text-xs bg-red-600 text-white rounded'>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRequests;

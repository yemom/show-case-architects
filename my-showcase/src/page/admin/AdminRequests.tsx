import React, { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../../context/useAppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Admin = { _id: string; email: string; role: string; isApproved?: boolean };
type EditFormState = {
    id: string;
    email: string;
    role: 'admin' | 'super';
    isApproved: boolean;
};

const AdminRequests: React.FC = () => {
    const { axios, token, userRole } = useAppContext();
    const navigate = useNavigate();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [actionId, setActionId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<EditFormState | null>(null);
    const [isModalSaving, setIsModalSaving] = useState(false);

    const fetchAdmins = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/admin/admins', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (data.success) setAdmins(data.admins);
            else toast.error(data.message || 'We could not load admin accounts right now.');
        } catch (err: unknown) {
            const message =
                (typeof err === 'object' && err && 'response' in err &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err as any).response?.data?.message) || 'We could not load admin accounts right now.';
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
            } else toast.error(data.message || 'We could not approve this admin right now.');
        } catch (err: unknown) {
            const message =
                (typeof err === 'object' && err && 'response' in err &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err as any).response?.data?.message) || 'We could not approve this admin right now.';
            toast.error(message);
        }
    };

    const onDelete = async (id: string) => {
        try {
            const target = admins.find((item) => item._id === id);
            if (target?.role === 'super') {
                toast.error('Super admin account is protected and cannot be deleted');
                return;
            }

            if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;
            setActionId(id);
            const { data } = await axios.post(
                '/api/admin/delete-admin',
                { id },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            if (data.success) {
                toast.success('Admin deleted');
                fetchAdmins();
            } else toast.error(data.message || 'We could not delete this admin right now.');
        } catch (err: unknown) {
            const message =
                (typeof err === 'object' && err && 'response' in err &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err as any).response?.data?.message) || 'We could not delete this admin right now.';
            toast.error(message);
        } finally {
            setActionId(null);
        }
    };

    const onOpenEdit = (admin: Admin) => {
        if (admin.role === 'super') {
            toast.error('Super admin account is protected and cannot be edited');
            return;
        }

        setEditForm({
            id: admin._id,
            email: admin.email,
            role: admin.role === 'super' ? 'super' : 'admin',
            isApproved: Boolean(admin.isApproved),
        });
    };

    const onCloseEdit = () => {
        if (isModalSaving) return;
        setEditForm(null);
    };

    const onSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editForm || isModalSaving) return;

        const nextEmail = editForm.email.trim().toLowerCase();
        if (!nextEmail) {
            toast.error('Please enter a valid email address.');
            return;
        }

        try {
            setIsModalSaving(true);
            setActionId(editForm.id);

            const { data } = await axios.post(
                '/api/admin/update-admin',
                {
                    id: editForm.id,
                    email: nextEmail,
                    role: editForm.role,
                    isApproved: editForm.isApproved,
                },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );

            if (data.success) {
                toast.success(data.message || 'Admin updated');
                setEditForm(null);
                fetchAdmins();
            } else {
                toast.error(data.message || 'We could not update this admin right now.');
            }
        } catch (err: unknown) {
            const message =
                (typeof err === 'object' && err && 'response' in err &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err as any).response?.data?.message) || 'We could not update this admin right now.';
            toast.error(message);
        } finally {
            setIsModalSaving(false);
            setActionId(null);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error('Please sign in as a super admin to continue.');
            navigate('/admin');
            return;
        }
        if (userRole !== 'super') {
            toast.error('Only super admins can access this page.');
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
                        {admins.length === 0 ? (
                            <tr>
                                <td colSpan={4} className='px-4 py-6 text-center text-[#637081]'>No admin requests found</td>
                            </tr>
                        ) : admins.map((a) => (
                            <tr key={a._id} className='border-t border-[#a9bacd]/35 bg-[#f4f7fb] hover:bg-[#dde5ee] transition-colors'>
                                <td className='px-4 py-3 text-[#1a2329]'>{a.email}</td>
                                <td className='px-4 py-3 text-[#5f6f80]'>{a.role}</td>
                                <td className='px-4 py-3 text-[#5f6f80]'>{a.isApproved ? 'Approved' : 'Pending'}</td>
                                <td className='px-4 py-3 space-x-2'>
                                    {!a.isApproved && (
                                        <button
                                            onClick={() => onApprove(a._id)}
                                            disabled={actionId === a._id}
                                            className='px-3 py-1 text-xs border border-emerald-600/55 bg-emerald-500/12 text-emerald-700 disabled:opacity-50'
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {a.role !== 'super' ? (
                                        <>
                                            <button
                                                onClick={() => onOpenEdit(a)}
                                                disabled={actionId === a._id}
                                                className='px-3 py-1 text-xs border border-[#a9bacd]/70 bg-[#f4f7fb] text-[#49596b] disabled:opacity-50'
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(a._id)}
                                                disabled={actionId === a._id}
                                                className='px-3 py-1 text-xs border border-[#b86f4e]/70 bg-[#b86f4e]/12 text-[#7d442f] disabled:opacity-50'
                                            >
                                                {actionId === a._id ? 'Working...' : 'Delete'}
                                            </button>
                                        </>
                                    ) : (
                                        <span className='text-xs text-[#7a8a9c] uppercase tracking-[0.12em]'>Protected</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            {editForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#17212b]/45 p-4'>
                    <div className='w-full max-w-md border border-[#a9bacd]/55 bg-[#eaf0f6] p-5 sm:p-6'>
                        <p className='text-[10px] uppercase tracking-[0.18em] text-[#637081]'>Admin Manager</p>
                        <h2 className='architectural-heading text-[34px] leading-[0.9] mt-2 text-[#1a2329]'>Edit Admin</h2>

                        <form onSubmit={onSaveEdit} className='mt-5 space-y-3'>
                            <div>
                                <p className='text-xs uppercase tracking-[0.12em] text-[#637081] mb-1'>Email</p>
                                <input
                                    type='email'
                                    value={editForm.email}
                                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, email: e.target.value } : prev))}
                                    className='w-full px-3 h-11 border border-[#a9bacd]/55 bg-[#f4f7fb] text-[#1a2329] outline-none'
                                    placeholder='admin@example.com'
                                    required
                                />
                            </div>

                            <div>
                                <p className='text-xs uppercase tracking-[0.12em] text-[#637081] mb-1'>Role</p>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => {
                                        const value = e.target.value === 'super' ? 'super' : 'admin';
                                        setEditForm((prev) => (prev ? { ...prev, role: value } : prev));
                                    }}
                                    className='w-full px-3 h-11 border border-[#a9bacd]/55 bg-[#f4f7fb] text-[#1a2329] outline-none'
                                >
                                    <option value='admin'>admin</option>
                                    <option value='super'>super</option>
                                </select>
                            </div>

                            <label className='flex items-center gap-2 text-[#4f5f71] text-sm'>
                                <input
                                    type='checkbox'
                                    checked={editForm.isApproved}
                                    onChange={(e) => setEditForm((prev) => (prev ? { ...prev, isApproved: e.target.checked } : prev))}
                                    className='scale-110 cursor-pointer'
                                />
                                Approved
                            </label>

                            <div className='flex gap-3 pt-1'>
                                <button
                                    type='submit'
                                    disabled={isModalSaving}
                                    className='h-10 px-4 bg-[#b86f4e] text-white text-[11px] uppercase tracking-[0.12em] disabled:opacity-50'
                                >
                                    {isModalSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type='button'
                                    onClick={onCloseEdit}
                                    disabled={isModalSaving}
                                    className='h-10 px-4 border border-[#a9bacd]/70 bg-[#f4f7fb] text-[#49596b] text-[11px] uppercase tracking-[0.12em] disabled:opacity-50'
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRequests;

import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
  const { axios } = useAppContext();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get('email') || '';
  const token = params.get('token') || '';
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirm) return toast.error('Passwords do not match');
    if (!email || !token) return toast.error('Invalid reset link');
    try {
      setLoading(true);
      const { data } = await axios.post('/api/admin/reset-password', { email, token, password });
      if (data.success) {
        toast.success(data.message || 'Password reset successful');
        navigate('/admin');
      } else {
        toast.error(data.message || 'Reset failed');
      }
    } catch (err: unknown) {
      const message =
        (typeof err === 'object' && err && 'response' in err &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).response?.data?.message) || 'Reset failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='w-full py-6 text-center'>
          <h1 className='text-3xl font-bold'><span className='text-primary'>Reset</span> Password</h1>
          <p className='font-light text-sm break-all'>{email}</p>
        </div>
        <form onSubmit={onSubmit} className='mt-4 text-gray-600'>
          <div className='flex flex-col gap-2 mb-4'>
            <label className='flex justify-between items-center'>New Password
              <button type='button' onClick={() => setShowPassword((p) => !p)} className='text-xs text-primary hover:underline ml-2'>{showPassword ? 'Hide' : 'Show'}</button>
            </label>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className='w-full border-b-2 border-gray-300 p-2 outline-none' />
          </div>
          <div className='flex flex-col gap-2 mb-6'>
            <label>Confirm Password</label>
            <input type={showPassword ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} className='w-full border-b-2 border-gray-300 p-2 outline-none' />
          </div>
          <button disabled={loading} type='submit' className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-60'>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

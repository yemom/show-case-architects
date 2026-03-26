import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';
import AuthShell from './AuthShell';

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
    <AuthShell
      title='Reset Password'
      subtitle={`Resetting account: ${email || 'Unknown email'}`}
      footerText='Need a new code?'
      footerLinkLabel='Forgot password'
      footerLinkTo='/admin/forgot-password'
    >
      <form onSubmit={onSubmit} className='text-[#d9e5f1] space-y-4'>
        <div>
          <label className='flex justify-between items-center text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>
            <span>New Password</span>
            <button type='button' onClick={() => setShowPassword((p) => !p)} className='text-[10px] text-[#f0d5c8] hover:text-white ml-2'>{showPassword ? 'Hide' : 'Show'}</button>
          </label>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className='w-full h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none' />
        </div>
        <div>
          <label className='block text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>Confirm Password</label>
          <input type={showPassword ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} className='w-full h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none' />
        </div>
        <button disabled={loading} type='submit' className='w-full h-11 bg-[#b86f4e] text-white text-[11px] uppercase tracking-[0.12em] hover:bg-[#a76142] transition-colors disabled:opacity-60'>
            {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';
import AuthShell from './AuthShell';

const ResetPasswordCode: React.FC = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const passedEmail = params.get('email') || '';
  const [email, setEmail] = React.useState(passedEmail);
  const [code, setCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !code || !password) return toast.error('All fields required');
    if (password !== confirm) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 chars');
    try {
      setLoading(true);
      const { data } = await axios.post('/api/admin/reset-password-code', { email, code, password });
      if (data.success) {
        toast.success('Password reset successful');
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
      title='Reset By Code'
      subtitle='Enter the verification code sent to your inbox and set a new password.'
      footerText='Need another reset method?'
      footerLinkLabel='Reset with link'
      footerLinkTo='/admin/reset-password'
    >
      <form onSubmit={submit} className='text-[#d9e5f1] flex flex-col gap-4'>
        <div className='flex flex-col'>
          <label className='text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>Email</label>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none' />
        </div>
        <div className='flex flex-col'>
          <label className='text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} maxLength={6} placeholder='123456' className='h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] tracking-widest text-center outline-none' />
        </div>
        <div className='flex flex-col'>
          <label className='flex justify-between items-center text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>
            <span>New Password</span>
            <button type='button' onClick={() => setShowPwd((p) => !p)} className='text-[10px] text-[#f0d5c8] hover:text-white'>{showPwd ? 'Hide' : 'Show'}</button>
          </label>
          <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className='h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none' />
        </div>
        <div className='flex flex-col'>
          <label className='text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>Confirm Password</label>
          <input type={showPwd ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} className='h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none' />
        </div>
        <button disabled={loading} type='submit' className='w-full h-11 bg-[#b86f4e] text-white text-[11px] uppercase tracking-[0.12em] hover:bg-[#a76142] transition-colors disabled:opacity-60'>{loading ? 'Resetting...' : 'Reset Password'}</button>
      </form>
    </AuthShell>
  );
};

export default ResetPasswordCode;

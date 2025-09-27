import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

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
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='w-full py-4 text-center'>
          <h1 className='text-2xl font-bold'><span className='text-primary'>Reset</span> Password (Code)</h1>
          <p className='text-xs text-gray-500 mt-1'>Enter the 6-digit code sent to your email.</p>
        </div>
        <form onSubmit={submit} className='text-gray-600 flex flex-col gap-4'>
          <div className='flex flex-col'>
            <label className='text-sm mb-1'>Email</label>
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='border-b-2 border-gray-300 p-2 outline-none' />
          </div>
          <div className='flex flex-col'>
            <label className='text-sm mb-1'>Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} maxLength={6} placeholder='123456' className='border-b-2 border-gray-300 p-2 tracking-widest text-center outline-none' />
          </div>
          <div className='flex flex-col'>
            <label className='flex justify-between items-center text-sm mb-1'>New Password
              <button type='button' onClick={() => setShowPwd((p) => !p)} className='text-xs text-primary hover:underline'>{showPwd ? 'Hide' : 'Show'}</button>
            </label>
            <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className='border-b-2 border-gray-300 p-2 outline-none' />
          </div>
          <div className='flex flex-col'>
            <label className='text-sm mb-1'>Confirm Password</label>
            <input type={showPwd ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} className='border-b-2 border-gray-300 p-2 outline-none' />
          </div>
          <button disabled={loading} type='submit' className='w-full py-3 font-medium bg-primary text-white rounded hover:bg-primary/90 transition disabled:opacity-60'>{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordCode;

import React from 'react';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell';

const ForgotPassword: React.FC = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address.');
    try {
      setLoading(true);
      const { data } = await axios.post('/api/admin/forgot-password-code', { email });
      toast.success(data.message || 'If that email exists, a reset code has been sent.');
      navigate(`/admin/reset-password-code?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const message =
        (typeof err === 'object' && err && 'response' in err &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).response?.data?.message) || 'We could not send a reset code right now. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title='Forgot Password'
      subtitle='Enter your email to receive a secure 6-digit password reset code.'
      footerText='Remembered your password?'
      footerLinkLabel='Back to login'
      footerLinkTo='/admin/login'
    >
      <form onSubmit={onSubmit} className='text-[#d9e5f1] space-y-4'>
        <div>
          <label className='block text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>Email</label>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none' />
        </div>
        <button disabled={loading} type='submit' className='w-full h-11 bg-[#b86f4e] text-white text-[11px] uppercase tracking-[0.12em] hover:bg-[#a76142] transition-colors disabled:opacity-60'>
            {loading ? 'Sending...' : 'Send Code'}
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;

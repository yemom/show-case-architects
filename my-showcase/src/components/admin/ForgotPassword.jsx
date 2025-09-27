import React from 'react';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Email required');
    try {
      setLoading(true);
  const { data } = await axios.post('/api/admin/forgot-password-code', { email });
  toast.success(data.message || 'If that email exists, a reset code has been sent.');
  // Navigate to code entry page (pass email)
  navigate(`/admin/reset-password-code?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='w-full py-6 text-center'>
          <h1 className='text-3xl font-bold'><span className='text-primary'>Forgot</span> Password</h1>
          <p className='font-light text-sm'>Enter your email to get a 6-digit reset code.</p>
        </div>
        <form onSubmit={onSubmit} className='mt-4 text-gray-600'>
          <label className='block mb-2'>Email</label>
          <input type='email' value={email} onChange={e=>setEmail(e.target.value)} className='w-full border-b-2 border-gray-300 p-2 outline-none mb-6' />
          <button disabled={loading} type='submit' className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-60'>
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

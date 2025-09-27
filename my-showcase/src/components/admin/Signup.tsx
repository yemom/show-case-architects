import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Email & password required');
    try {
      const { data } = await axios.post('/api/admin/request-access', { email, password });
      if (data.success) {
        toast.success(data.message || 'Request submitted. A super admin must approve your account.');
        navigate('/admin');
        return;
      }
      toast.error(data.message || 'Request failed');
    } catch (error: unknown) {
      const status = (typeof error === 'object' && error && 'response' in error)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (error as any).response?.status
        : undefined;
      const message = (typeof error === 'object' && error && 'response' in error)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (error as any).response?.data?.message || 'Request failed'
        : 'Request failed';
      if (status === 400 && /No super admin exists/i.test(message)) {
        try {
          const signupRes = await axios.post('/api/admin/signup', { email, password });
          if (signupRes.data?.success && signupRes.data?.token) {
            toast.success('Super admin created successfully. You are now logged in.');
            localStorage.setItem('token', signupRes.data.token);
            window.location.href = '/admin';
            return;
          }
          toast.error(signupRes.data?.message || 'Super admin signup failed');
        } catch (signupErr: unknown) {
          const signupMessage =
            (typeof signupErr === 'object' && signupErr && 'response' in signupErr &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (signupErr as any).response?.data?.message) || 'Super admin signup failed';
          toast.error(signupMessage);
        }
        return;
      }
      toast.error(message);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='w-full py-6 text-center'>
          <h1 className='text-3xl font-bold'><span className='text-primary'>Admin</span> Access / Setup</h1>
          <p className='font-light text-sm'>If no super admin exists yet, this will create the first super admin. Otherwise it submits an access request.</p>
        </div>
        <form onSubmit={onSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
          <div className='flex flex-col gap-4'>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' className='border-b-2 border-gray-300 p-2 outline-none mb-6' />
          </div>
          <div className='flex flex-col gap-2 mb-6'>
            <label className='flex justify-between items-center'>
              <span>Password</span>
              <button type='button' onClick={() => setShowPassword((p) => !p)} className='text-xs text-primary hover:underline'>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} className='border-b-2 border-gray-300 p-2 outline-none' />
          </div>
          <button type='submit' className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all'>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

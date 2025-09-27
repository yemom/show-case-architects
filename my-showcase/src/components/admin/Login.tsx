import React from 'react';
import { useAppContext } from '../../context/useAppContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const { axios, setToken } = useAppContext();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/admin/login', { email, password });
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      const status = (typeof error === 'object' && error && 'response' in error)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (error as any).response?.status
        : undefined;
      if (status === 404) {
        toast.error('Login endpoint not found (check backend /api/admin/login)');
      } else {
        const message = (typeof error === 'object' && error && 'response' in error)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? (error as any).response?.data?.message
          : undefined;
        toast.error(message || 'Login failed');
      }
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full py-6 text-center'>
            <h1 className='text-3xl font-bold'><span className='text-primary'>Admin</span> Login</h1>
            <p className='font-light'>Enter your credentials to access the admin panel</p>
          </div>
          <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
            <div className='flex flex-col gap-4'>
              <label>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type='email'
                placeholder='email'
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>
            <div className='flex flex-col gap-2 mb-6'>
              <label className='flex justify-between items-center'>
                <span>Password</span>
                <button
                  type='button'
                  onClick={() => setShowPassword((p) => !p)}
                  className='text-xs text-primary hover:underline'
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </label>
              <div className='relative'>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  className='w-full border-b-2 border-gray-300 p-2 outline-none pr-16'
                />
              </div>
              <div className='text-right -mt-2'>
                <Link to='/admin/forgot-password' className='text-xs text-primary hover:underline'>Forgot password?</Link>
              </div>
            </div>
            <button
              type='submit'
              className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

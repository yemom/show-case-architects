import React from 'react';
import { useAppContext } from '../../context/useAppContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthShell from './AuthShell';

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
        <AuthShell
            title='Admin Login'
            subtitle='Enter your credentials to access architecture operations and publication controls.'
            footerText='Need access?'
            footerLinkLabel='Create request'
            footerLinkTo='/admin/signup'
        >
            <form onSubmit={handleSubmit} className='text-[#d9e5f1] space-y-4'>
                <div>
                    <label className='block text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type='email'
                        placeholder='admin@studio.com'
                        className='w-full h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none'
                    />
                </div>

                <div>
                    <label className='flex justify-between items-center text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>
                        <span>Password</span>
                        <button
                            type='button'
                            onClick={() => setShowPassword((p) => !p)}
                            className='text-[10px] text-[#f0d5c8] hover:text-white'
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        className='w-full h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none'
                    />
                    <div className='text-right mt-2'>
                        <Link to='/admin/forgot-password' className='text-[11px] uppercase tracking-[0.12em] text-[#f0d5c8] hover:text-white'>Forgot password?</Link>
                    </div>
                </div>

                <button type='submit' className='w-full h-11 bg-[#b86f4e] text-white text-[11px] uppercase tracking-[0.12em] hover:bg-[#a76142] transition-colors'>
                    Login
                </button>
            </form>
        </AuthShell>
    );
};

export default Login;

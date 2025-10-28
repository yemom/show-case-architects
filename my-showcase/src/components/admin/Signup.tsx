import React from 'react';
// no navigation after signup; users must wait for approval
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
    const { axios } = useAppContext();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Email & password required');
        try {
            const { data } = await axios.post('/api/admin/request-access', { email, password });
            if (data.success) {
                // Always show a pending message and do not auto-create or auto-login any account here.
                toast.success(data.message || 'Request submitted. A super admin must approve your account.');
                // Do NOT navigate or log the user in automatically. Show a simple pending state.
                setSubmitted(true);
                return;
            }
            toast.error(data.message || 'Request failed');
        } catch (error: unknown) {
            const message = (typeof error === 'object' && error && 'response' in error)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (error as any).response?.data?.message || 'Request failed'
                : 'Request failed';
            toast.error(message);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen bg-architectural-light'>
            <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg bg-white'>
                <div className='w-full py-6 text-center'>
                    <h1 className='text-3xl font-bold'><span className='text-primary'>Admin</span> Access / Setup</h1>
                    <p className='font-light text-sm'>Submit a request for admin access. All requests (including the initial one) require approval by a super admin — you will not be logged in automatically.</p>
                </div>
                <form onSubmit={onSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
                    <div className='flex flex-col gap-4'>
                        <label>Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' className='border-b-2 border-gray-300 p-2 outline-none mb-6' disabled={submitted} />
                    </div>
                    <div className='flex flex-col gap-2 mb-6'>
                        <label className='flex justify-between items-center'>
                            <span>Password</span>
                            <button type='button' onClick={() => setShowPassword((p) => !p)} className='text-xs text-primary hover:underline'>
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} className='border-b-2 border-gray-300 p-2 outline-none' disabled={submitted} />
                    </div>
                    <button type='submit' disabled={submitted} className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all'>
                        {submitted ? 'Request submitted — wait for approval' : 'Sign Up'}
                    </button>
                    {submitted && (
                        <div className='mt-4 text-center text-sm text-gray-700'>
                            Thank you — your request is pending approval by a super admin. You will not be logged in automatically.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Signup;

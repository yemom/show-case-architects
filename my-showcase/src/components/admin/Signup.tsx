import React from 'react';
// no navigation after signup; users must wait for approval
import { useAppContext } from '../../context/useAppContext';
import toast from 'react-hot-toast';
import AuthShell from './AuthShell';

const Signup: React.FC = () => {
    const { axios } = useAppContext();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Please enter both email and password.');
        try {
            const { data } = await axios.post('/api/admin/request-access', { email, password });
            if (data.success) {
                // Always show a pending message and do not auto-create or auto-login any account here.
                toast.success(data.message || 'Request submitted. A super admin must approve your account.');
                // Do NOT navigate or log the user in automatically. Show a simple pending state.
                setSubmitted(true);
                return;
            }
            toast.error(data.message || 'We could not submit your request right now. Please try again.');
        } catch (error: unknown) {
            const message = (typeof error === 'object' && error && 'response' in error)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ? (error as any).response?.data?.message || 'We could not submit your request right now. Please try again.'
                : 'We could not submit your request right now. Please try again.';
            toast.error(message);
        }
    };

    return (
        <AuthShell
            title='Access Request'
            subtitle='Submit a request for admin access. All requests require super-admin approval before account activation.'
            footerText='Already approved?'
            footerLinkLabel='Go to login'
            footerLinkTo='/admin/login'
        >
            <form onSubmit={onSubmit} className='text-[#d9e5f1] space-y-4'>
                <div>
                    <label className='block text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' disabled={submitted} className='w-full h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none disabled:opacity-70' />
                </div>

                <div>
                    <label className='flex justify-between items-center text-[11px] uppercase tracking-[0.12em] text-[#8fa6be] mb-2'>
                        <span>Password</span>
                        <button type='button' onClick={() => setShowPassword((p) => !p)} className='text-[10px] text-[#f0d5c8] hover:text-white'>
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} disabled={submitted} className='w-full h-11 px-3 border border-white/20 bg-[#0f151b] text-[#e8f1fb] outline-none disabled:opacity-70' />
                </div>

                <button type='submit' disabled={submitted} className='w-full h-11 bg-[#b86f4e] text-white text-[11px] uppercase tracking-[0.12em] hover:bg-[#a76142] transition-colors disabled:opacity-60'>
                    {submitted ? 'Request submitted — wait for approval' : 'Submit Request'}
                </button>

                {submitted && (
                    <div className='text-sm text-[#9db2c8] leading-7'>
                        Your request is pending approval by a super admin. You will not be logged in automatically.
                    </div>
                )}
            </form>
        </AuthShell>
    );
};

export default Signup;

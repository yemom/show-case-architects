import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkLabel?: string;
  footerLinkTo?: string;
};

const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkLabel,
  footerLinkTo,
}) => {
  return (
    <div className='min-h-screen bg-[#0f151b] bg-[radial-gradient(circle_at_1px_1px,rgba(118,139,160,0.18)_1px,transparent_0)] bg-[size:18px_18px] p-4 sm:p-6'>
      <div className='min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)] grid lg:grid-cols-[1.15fr_1fr] border border-white/10 bg-[#111821]'>
        <aside className='hidden lg:flex flex-col justify-between p-10 border-r border-white/10'>
          <div>
            <img src={assets.logo} alt='Studio 21 Architects' className='h-10 w-auto' draggable={false} />
            <p className='text-[10px] uppercase tracking-[0.2em] text-[#8da3ba] mt-8'>Architecture Admin Suite</p>
            <h2 className='architectural-heading text-[64px] leading-[0.86] text-[#dbe8f6] mt-4'>Blueprint Control Center</h2>
            <p className='text-[#97acc2] mt-4 max-w-md leading-7'>
              Precision publishing, review operations, and project intelligence in one structured interface.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='border border-white/10 bg-[#151f29] p-4'>
              <p className='text-[10px] uppercase tracking-[0.14em] text-[#8fa3b9]'>System</p>
              <p className='architectural-heading text-[30px] text-[#d9e6f4] mt-1'>Secure</p>
            </div>
            <div className='border border-white/10 bg-[#b86f4e] p-4'>
              <p className='text-[10px] uppercase tracking-[0.14em] text-[#f7dfd3]'>Mode</p>
              <p className='architectural-heading text-[30px] text-white mt-1'>Live</p>
            </div>
          </div>
        </aside>

        <main className='flex items-center justify-center p-6 sm:p-10'>
          <div className='w-full max-w-md border border-white/12 bg-[#121a22] p-6 sm:p-8'>
            <p className='text-[10px] uppercase tracking-[0.2em] text-[#90a5ba] mb-3'>Admin Access</p>
            <h1 className='architectural-heading text-[44px] leading-[0.9] text-[#e4edf6]'>{title}</h1>
            <p className='text-[#98adc4] text-sm leading-7 mt-3'>{subtitle}</p>

            <div className='mt-6'>{children}</div>

            {footerText && footerLinkLabel && footerLinkTo && (
              <p className='mt-5 text-sm text-[#8fa6be]'>
                {footerText}{' '}
                <Link to={footerLinkTo} className='text-[#f0d5c8] hover:text-white underline-offset-4 hover:underline'>
                  {footerLinkLabel}
                </Link>
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthShell;

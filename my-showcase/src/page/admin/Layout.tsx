import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { assets } from '../../assets/assets';
import Sidebar from '../../components/admin/Sidebar';
import { useAppContext } from '../../context/useAppContext';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { axios, setToken } = useAppContext();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-[#11161d] text-[#dce5ef]'>
      <div className='h-[70px] border-b border-white/10 bg-[#0e1318] px-4 sm:px-8 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setMobileOpen((v) => !v)}
            className='md:hidden h-9 w-9 border border-white/20 flex items-center justify-center hover:border-white/50 transition-colors'
            aria-label='Toggle navigation'
          >
            <Menu size={16} />
          </button>
          <button
            type='button'
            onClick={() => setCollapsed((v) => !v)}
            className='hidden md:inline-flex h-9 w-9 border border-white/20 items-center justify-center hover:border-white/50 transition-colors'
            aria-label='Collapse sidebar'
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
          <img src={assets.logo} alt='' className='h-9 sm:h-10 w-auto object-contain cursor-pointer' onClick={() => navigate('/')} />
          <p className='hidden sm:block text-[10px] uppercase tracking-[0.18em] text-[#90a3b8]'>Admin Dashboard</p>
        </div>

        <button
          onClick={logout}
          className='h-10 px-5 border border-[#b86f4e]/60 bg-[#b86f4e] text-white text-[11px] uppercase tracking-[0.12em] hover:bg-[#a76142] transition-colors cursor-pointer'
        >
          Logout
        </button>
      </div>

      <div className='flex h-[calc(100vh-70px)] overflow-hidden'>
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />

        <main className='flex-1 overflow-auto bg-[radial-gradient(circle_at_1px_1px,rgba(118,139,160,0.18)_1px,transparent_0)] bg-[size:18px_18px]'>
          <div className='min-h-full bg-[linear-gradient(180deg,rgba(17,22,29,0.76),rgba(17,22,29,0.92))]'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

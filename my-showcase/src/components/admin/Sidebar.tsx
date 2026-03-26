import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/useAppContext';

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, mobileOpen, onNavigate }) => {
  const { userRole } = useAppContext();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 py-3 px-3 rounded-sm transition-all ${
      collapsed ? 'md:justify-center md:px-2' : 'md:px-3'
    } ${isActive ? 'bg-[#b86f4e]/18 border border-[#b86f4e]/40 text-[#f6e7df]' : 'text-[#a7b8ca] hover:bg-white/5 hover:text-white'}`;

  return (
    <>
      <aside
        className={`fixed md:static top-[70px] left-0 z-40 h-[calc(100vh-70px)] border-r border-white/10 bg-[#10161d] transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-[84px]' : 'md:w-[270px]'} w-[260px]`}
      >
        <div className='h-full p-3 flex flex-col'>
          <p className={`text-[10px] uppercase tracking-[0.18em] text-[#73869c] mb-3 px-2 ${collapsed ? 'md:hidden' : ''}`}>Core Modules</p>

          <nav className='space-y-2'>
            <NavLink end to='/admin' className={linkClass} onClick={onNavigate}>
              <img src={assets.home_icon} alt='' className='w-4 h-4' />
              <p className={`text-[11px] uppercase tracking-[0.12em] ${collapsed ? 'md:hidden' : ''}`}>Dashboard</p>
            </NavLink>

            <NavLink end to='/admin/add-blog' className={linkClass} onClick={onNavigate}>
              <img src={assets.add_icon} alt='' className='w-4 h-4' />
              <p className={`text-[11px] uppercase tracking-[0.12em] ${collapsed ? 'md:hidden' : ''}`}>New Project</p>
            </NavLink>

            <NavLink end to='/admin/list-blog' className={linkClass} onClick={onNavigate}>
              <img src={assets.list_icon} alt='' className='w-4 h-4' />
              <p className={`text-[11px] uppercase tracking-[0.12em] ${collapsed ? 'md:hidden' : ''}`}>All Projects</p>
            </NavLink>

            <NavLink end to='/admin/comments' className={linkClass} onClick={onNavigate}>
              <img src={assets.comment_icon} alt='' className='w-4 h-4' />
              <p className={`text-[11px] uppercase tracking-[0.12em] ${collapsed ? 'md:hidden' : ''}`}>Comments</p>
            </NavLink>

            {userRole === 'super' && (
              <NavLink end to='/admin/requests' className={linkClass} onClick={onNavigate}>
                <img src={assets.list_icon} alt='' className='w-4 h-4' />
                <p className={`text-[11px] uppercase tracking-[0.12em] ${collapsed ? 'md:hidden' : ''}`}>Admin Requests</p>
              </NavLink>
            )}
          </nav>

          <div className='mt-auto p-2 border border-white/10 bg-[#131c25]'>
            <p className={`text-[10px] text-[#91a5bb] uppercase tracking-[0.12em] ${collapsed ? 'md:hidden' : ''}`}>Studio 21 Admin</p>
            <p className={`text-[11px] text-[#7388a0] mt-1 ${collapsed ? 'md:hidden' : ''}`}>Architecture Suite</p>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type='button'
          className='md:hidden fixed inset-0 bg-black/45 z-30'
          onClick={onNavigate}
          aria-label='Close sidebar backdrop'
        />
      )}
    </>
  );
};

export default Sidebar;

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
    `flex items-center gap-2 py-2.5 rounded-sm transition-all ${
      collapsed ? 'md:justify-center md:px-2' : 'md:pl-2 md:pr-2.5'
    } ${isActive ? 'bg-[#b86f4e]/12 border border-[#b86f4e]/45 text-[#7d442f]' : 'text-[#5f6f80] hover:bg-[#dde5ee] hover:text-[#1a2329]'}`;

  return (
    <>
      <aside
        className={`fixed md:static top-[70px] left-0 z-40 h-[calc(100vh-70px)] border-r border-[#a9bacd]/55 bg-[#eef2f6] transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-[84px]' : 'md:w-[270px]'} w-[260px]`}
      >
        <div className='h-full p-3.5 flex flex-col'>
          <p className={`text-[9px] font-semibold uppercase tracking-[0.22em] text-[#637081] mb-3 px-2 ${collapsed ? 'md:hidden' : ''}`}>Core Modules</p>

          <nav className='space-y-1.5'>
            <NavLink end to='/admin' className={linkClass} onClick={onNavigate}>
              <img src={assets.home_icon} alt='' className='w-[13px] h-[13px] ml-0.5' />
              <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${collapsed ? 'md:hidden' : ''}`}>Dashboard</p>
            </NavLink>

            <NavLink end to='/admin/add-blog' className={linkClass} onClick={onNavigate}>
              <img src={assets.add_icon} alt='' className='w-[13px] h-[13px] ml-0.5' />
              <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${collapsed ? 'md:hidden' : ''}`}>New Project</p>
            </NavLink>

            <NavLink end to='/admin/list-blog' className={linkClass} onClick={onNavigate}>
              <img src={assets.list_icon} alt='' className='w-[13px] h-[13px] ml-0.5' />
              <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${collapsed ? 'md:hidden' : ''}`}>All Projects</p>
            </NavLink>

            <NavLink end to='/admin/create-category' className={linkClass} onClick={onNavigate}>
              <img src={assets.add_icon} alt='' className='w-[13px] h-[13px] ml-0.5' />
              <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${collapsed ? 'md:hidden' : ''}`}>New Category</p>
            </NavLink>

            <NavLink end to='/admin/edit-category' className={linkClass} onClick={onNavigate}>
              <img src={assets.list_icon} alt='' className='w-[13px] h-[13px] ml-0.5' />
              <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${collapsed ? 'md:hidden' : ''}`}>Edit Category</p>
            </NavLink>

            <NavLink end to='/admin/comments' className={linkClass} onClick={onNavigate}>
              <img src={assets.comment_icon} alt='' className='w-[13px] h-[13px] ml-0.5' />
              <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${collapsed ? 'md:hidden' : ''}`}>Comments</p>
            </NavLink>

            {userRole === 'super' && (
              <NavLink end to='/admin/requests' className={linkClass} onClick={onNavigate}>
                <img src={assets.list_icon} alt='' className='w-[13px] h-[13px] ml-0.5' />
                <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${collapsed ? 'md:hidden' : ''}`}>Admin Requests</p>
              </NavLink>
            )}
          </nav>

          <div className='mt-auto p-2.5 border border-[#a9bacd]/55 bg-[#f4f7fb]'>
            <p className={`text-[9px] font-semibold text-[#637081] uppercase tracking-[0.16em] ${collapsed ? 'md:hidden' : ''}`}>Studio 21 Admin</p>
            <p className={`text-[10px] text-[#7a8a9c] mt-1 ${collapsed ? 'md:hidden' : ''}`}>Architecture Suite</p>
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

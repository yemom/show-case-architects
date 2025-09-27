import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/useAppContext';

const Sidebar: React.FC = () => {
  const { userRole } = useAppContext();
  return (
    <div>
      <NavLink end to='/admin' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
        <img src={assets.home_icon} alt='' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Dashboard</p>
      </NavLink>
      <NavLink end to='/admin/add-blog' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
        <img src={assets.add_icon} alt='' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Add Post</p>
      </NavLink>
      <NavLink end to='/admin/list-blog' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
        <img src={assets.list_icon} alt='' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>List Post</p>
      </NavLink>
      <NavLink end to='/admin/comments' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
        <img src={assets.comment_icon} alt='' className='min-w-4 w-5' />
        <p className='hidden md:inline-block'>Comment</p>
      </NavLink>
      {userRole === 'super' && (
        <NavLink end to='/admin/requests' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && 'bg-primary/10 border-r-4 border-primary'}`}>
          <img src={assets.list_icon} alt='' className='min-w-4 w-5' />
          <p className='hidden md:inline-block'>Admin Requests</p>
        </NavLink>
      )}
    </div>
  );
};

export default Sidebar;

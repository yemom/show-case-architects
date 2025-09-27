import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Sidebar from '../../components/admin/Sidebar';
import { useAppContext } from '../../context/useAppContext';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { axios, setToken } = useAppContext();

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  return (
    <>
      <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200 bg-gradient-to-r from-primary to-secondary text-white'>
        <img src={assets.logo} alt='' className='h-10 sm:h-12 xl:h-14 w-auto object-contain cursor-pointer' onClick={() => navigate('/')} />
        <button onClick={logout} className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer'>Logout</button>
      </div>
      <div className='flex h-[calc(100vh-70px)]'>
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;

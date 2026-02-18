import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div>
      <div className='flex justify-between' >
        <div className='w-[21%] h-full' >
          <Sidebar />
        </div>
        <div className='w-4/5'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
// .
export default Layout;

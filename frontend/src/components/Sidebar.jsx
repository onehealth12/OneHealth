import React, { useState } from 'react';
import AdminNavigation from './contents/AdminNavigation';
import StaffNavigation from './contents/StaffNavigation';
import NurseNavigation from './contents/NurseNavigation';

const Sidebar = ({ userRole }) => {



  return (
    <>
      <div className={'bg-[#4867D6] text-white h-screen relative p-4'}>
        
        <h3 className='text-center text-1xl uppercase'>{userRole}</h3>
        <div>
          <ul className='text-2xl'>
          {userRole === 'admin' && <AdminNavigation />}
          {userRole === 'receptionist' && <StaffNavigation />}
          {userRole === 'nurse' && <NurseNavigation />}
            </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

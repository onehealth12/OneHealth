import React from 'react';
import AdminNavigation from './contents/AdminNavigation';
import StaffNavigation from './contents/StaffNavigation';
import NurseNavigation from './contents/NurseNavigation';

const Sidebar = ({ userRole }) => {
  let roleInformation = '';

  // Set role-specific information
  if (userRole === 'admin') {
    roleInformation = 'Admin';
  } else if (userRole === 'receptionist') {
    roleInformation = 'Information Desk';
  } else if (userRole === 'nurse') {
    roleInformation = 'Nurse';
  } else {
    roleInformation = 'Unknown Role';
  }

  return (
    <>
      <div className={'bg-[#4867D6] text-white h-screen relative p-4'}>
        <h3 className='text-center text-1xl uppercase'>{roleInformation}</h3>
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

import React, { useState } from "react";
import UnifiedPatientTracker from '../../components/UnifiedPatientTracker';
import Sidebar from "../../components/Sidebar";


const AdminDashboard = () => {
    const [userRole, setUserRole] = useState("admin");
    const tokenObject = JSON.parse(localStorage.getItem("token"));
    const token = tokenObject.token;
  
    const headerToken = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return (
      <div className="flex w-screen">
        <Sidebar userRole={userRole} />
        <div className='w-full'>
          <UnifiedPatientTracker/>
        </div>
      </div>
    );
  };

export default AdminDashboard
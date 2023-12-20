import React, { useState } from "react";
import UnifiedPatientTracker from '../../components/UnifiedPatientTracker';
import Navbar from "../../components/Navbar";

const RadTechDashboard = () => {
    const [userRole, setUserRole] = useState("radTech");
    const tokenObject = JSON.parse(localStorage.getItem("token"));
    const token = tokenObject.token;
  
    const headerToken = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return (
      <div className="bg-gray-100">
        <Navbar userRole={userRole} />
        <div className='h-screen'>
          <UnifiedPatientTracker/>
        </div>
      </div>
    );
  };

export default RadTechDashboard
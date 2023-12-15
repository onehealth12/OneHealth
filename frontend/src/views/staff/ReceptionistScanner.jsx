import React, { useState } from "react";
import Scanner from "../../components/Scanner";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
const ReceptionistScanner = () => {
  const [userRole, setUserRole] = useState("receptionist");
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  const token = tokenObject.token;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return (
    <>
      <div className="flex h-screen">
        <Sidebar userRole={userRole} />
        <div className="w-full">
          <Scanner role={userRole} />
        </div>
      </div>
    </>
  );
};

export default ReceptionistScanner;

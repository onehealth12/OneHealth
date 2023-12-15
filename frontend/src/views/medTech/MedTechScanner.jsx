import React, { useState } from "react";
import Scanner from "../../components/Scanner";
import Navbar from "../../components/Navbar";

const MedTechScanner = () => {
  const [userRole, setUserRole] = useState("medTech");
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  const token = tokenObject.token;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return (
    <>
      <Navbar userRole={userRole} />
      <div>
        <Scanner role={userRole} />
      </div>
    </>
  );
};

export default MedTechScanner;

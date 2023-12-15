import React, { useState } from "react";
import Scanner from "../../components/Scanner";
import Navbar from "../../components/Navbar";

const DocScanner = () => {
  const [userRole, setUserRole] = useState("doctor");
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  const token = tokenObject.token;

  // Extract doctor's first and last name from the token
  const doctorFirstName = tokenObject.firstName || "";
  const doctorLastName = tokenObject.lastName || "";

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return (
    <>
      <Navbar userRole={userRole} />
      <div>
        {/* Use the Scanner component and pass the role, first name, and last name as props */}
        <Scanner
          role={userRole}
          doctorFirstName={doctorFirstName}
          doctorLastName={doctorLastName}
        />
      </div>
    </>
  );
};

export default DocScanner;

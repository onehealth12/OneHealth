import React, { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
const StaffNavigation = () => {
  const [showPatientMenu, setShowPatientMenu] = useState(false);
  const [showAppointmentsMenu, setShowAppointmentsMenu] = useState(false);

  const navigate = useNavigate();

  const togglePatientMenu = () => {
    setShowPatientMenu(!showPatientMenu);
  };

  const toggleAppointmentsMenu = () => {
    setShowAppointmentsMenu(!showAppointmentsMenu);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/receptionist/logout",
        null
      );

      if (response.status === 200) {
        // Logout successful, clear user info from local storage and redirect to the login page
        localStorage.removeItem("token");
        navigate("/hospital/auth/login"); // Assuming you're using Reach Router for navigation
      } else {
        // Handle server-side errors
        throw new Error(response.data.message);
      }
    } catch (error) {
      // Handle any network or other client-side errors
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <>
      <li className="py-4">
        <a href="/hospital/receptionist/">Dashboard</a>
      </li>
      <li className="">
        <Link to="/hospital/receptionist/scanner">Scanner</Link>
      </li>
      <li className="py-4">
        <a href="/hospital/receptionist/doctor">Doctor</a>
      </li>
      <li className="py-4">
        <a className="cursor-pointer" onClick={togglePatientMenu}>
          Patient
          {showPatientMenu ? " ▲" : " ▼"}
        </a>
        {showPatientMenu && (
          <ul>
            <li>
              <a
                className="text-base"
                href="/hospital/receptionist/patient/find"
              >
                - Find Patient
              </a>
            </li>
            <li>
              <a
                className="text-base"
                href="/hospital/receptionist/patient/create"
              >
                - Create Patient Account
              </a>
            </li>
          </ul>
        )}
      </li>
      <li className="py-4">
        <a className="cursor-pointer" onClick={toggleAppointmentsMenu}>
          Appointments
          {showAppointmentsMenu ? " ▲" : " ▼"}
        </a>
        {showAppointmentsMenu && (
          <ul>
            <li>
              <a
                className="text-base"
                href="/hospital/receptionist/appointment"
              >
                - Find Appointment
              </a>
            </li>
            <li>
              <a
                className="text-base"
                href="/hospital/receptionist/appointment/create"
              >
                - Create new appointment
              </a>
            </li>
          </ul>
        )}
      </li>
      <li className="pt-16 underline">
        <button onClick={handleLogout}>Logout</button>
      </li>
    </>
  );
};

export default StaffNavigation;

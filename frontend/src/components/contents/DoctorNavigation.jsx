import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    axios
      .post("http://localhost:5000/api/doctor/logout", null)
      .then((res) => {
        localStorage.removeItem("token");
        navigate("/hospital/auth/login");
      })
      .catch((err) => console.log("Error: " + err));
  };

  // Check if the token exists in local storage
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token; // Convert token to a boolean value

  return (
    <>
      <li className="">
        <Link to="/hospital/doctor/">Dashboard</Link>
      </li>
      <li className="">
        <Link to="/hospital/doctor/schedule">Visit Patient Status</Link>
      </li>
      <li className="">
        <Link to="/hospital/doctor/appointments">Appointment History</Link>
      </li>
      <li>
        <Link to="/hospital/doctor/availability">Availability</Link>
      </li>
      <li className="">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/hospital/auth/login">Login</Link>
        )}
      </li>
    </>
  );
};

export default DoctorNavigation;

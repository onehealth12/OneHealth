import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/OneHealthPNG.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";

import PatientNavigation from "./contents/PatientNavigation";
import DoctorNavigation from "./contents/DoctorNavigation";
import NurseNavigation from "./contents/NurseNavigation";

const Navbar = ({ userRole }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(!open);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/patient/logout",
        null
      );

      if (response.status === 200) {
        // Logout successful, clear user info from local storage and redirect to the login page
        localStorage.removeItem("token");
        navigate("/"); // Assuming you're using Reach Router for navigation
      } else {
        // Handle server-side errors
        throw new Error(response.data.message);
      }
    } catch (error) {
      // Handle any network or other client-side errors
      console.error("Error during logout:", error.message);
    }
  };

  // Check if the token exists in local storage
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token; // Convert token to a boolean value

  return (
    <div className="w-m h-[70px] flex justify-between items-center px-4 bg-[#4867D6] text-white  ">
      <img src={logo} width="200px" />
      <div className="w-1/3">
        <ul className="hidden md:flex md:justify-end gap-x-4 font-semibold">
          {userRole === 'patient' && <PatientNavigation/>}
          {userRole === 'doctor' && <DoctorNavigation/>}
          {userRole === 'nurse' && <NurseNavigation/>}
        </ul>
      </div>

      {/**Hamburger */}
      <div onClick={handleClick} className="md:hidden z-20">
        {!open ? (
          <GiHamburgerMenu cursor="pointer" fontSize="2em" />
        ) : (
          <AiOutlineClose cursor="pointer" color="white" fontSize="2em" />
        )}
      </div>
      <ul
        className={
          !open
            ? "hidden"
            : "absolute top-0 left-0 w-screen h-screen bg-[#4867D6] flex flex-col justify-center items-center z-10 gap-y-8 text-center"
        }
      >
        <li className="p-2 text-4xl w-full">
          <Link onClick={handleClick} to="/">
            Home
          </Link>
        </li>
        <li className="p-2 text-4xl w-full">
          <Link onClick={handleClick} to="/patient/book">
            Book An Appointment
          </Link>
        </li>
        <li className="p-2 text-4xl w-full">
          <Link onClick={handleClick} to="/patient/profile">
            Update Profile
          </Link>
        </li>
        <li className="p-2 text-4xl w-full">
          <Link onClick={handleClick} to="/patient/view-appointment">
            View Appointments
          </Link>
        </li>
        <li className="p-2 text-4xl w-full">
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;

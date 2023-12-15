import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../assets/OneHealthPNG.png'
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { BsCaretDownFill } from "react-icons/bs";

const PatientNavigation = () => {
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(!open);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    axios.post('http://localhost:5000/api/patient/logout', null)
          .then((res) => {
            localStorage.removeItem("token")
            navigate('/login')
          })
          .catch((err) => console.log("Error: " + err))
  };

  // Check if the token exists in local storage
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token; // Convert token to a boolean value

  return (
    <>
      <li className="">
        <Link to="/">Home</Link>
      </li>
      <li className="">
        <Link to="/patient/book">Book an Appointment</Link>
      </li>

      <ul className="">
        {isLoggedIn ? (
          <>
          <li className="relative" onClick={handleDropdownToggle}>
                <Link>
                  Profile <BsCaretDownFill className=" inline-block align-middle" />
                </Link>
                {isDropdownOpen && (
                  <ul className="z-50 absolute mt-2 p-2 bg-[#4867D6] shadow-lg rounded-md font-medium">
                    <li className="my-4">
                      <Link to="/patient/profile">Update Profile</Link>
                    </li>
                    <li className="my-4">
                      <Link to="/patient/view-appointment">View Appointments</Link>
                    </li>
                  </ul>
                )}
                <button className="ml-4" onClick={handleLogout}>Logout</button>
              </li>
          
          </>
                
        ) : (
          <Link to="/login">Login</Link>
        )}
      </ul>
    </>
  );
};

export default PatientNavigation;

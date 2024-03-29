import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminNavigation = () => {
  const [showDoctorMenu, setShowDoctorMenu] = useState(false);
  const [showNurseMenu, setShowNurseMenu] = useState(false);
  const [showMedTechMenu, setShowMedTechMenu] = useState(false);
  const [showRadTechMenu, setShowRadTechMenu] = useState(false);
  const [showAnnouncementMenu, setShowAnnouncementMenu] = useState(false);

  const navigate = useNavigate();
  const toggleDoctorMenu = () => {
    setShowDoctorMenu(!showDoctorMenu);
  };

  const toggleNurseMenu = () => {
    setShowNurseMenu(!showNurseMenu);
  };
  const toggleMedTechMenu = () => {
    setShowMedTechMenu(!showMedTechMenu);
  };
  const toggleRadTechMenu = () => {
    setShowRadTechMenu(!showRadTechMenu);
  };

  const toggleAnnouncementMenu = () => {
    setShowAnnouncementMenu(!showAnnouncementMenu);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://onehealth-backend.onrender.com/api/admin/logout",
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
        <a href="/hospital/admin/dashboard">Dashboard</a>
      </li>
      <li className="py-4">
        <a href="#" onClick={toggleAnnouncementMenu}>
          Announcement
          {showAnnouncementMenu ? " ▲" : " ▼"}
        </a>
        {showAnnouncementMenu && (
          <ul>
            <li>
              <a className="text-base" href="/hospital/admin/announcement/add">
                - Add Announcement
              </a>
            </li>
            <li>
              <a
                className="text-base"
                href="/hospital/admin/announcement/manage"
              >
                - Manage Announcements
              </a>
            </li>
          </ul>
        )}
      </li>
      <li className="py-4">
        <a href="/hospital/admin">Department</a>
      </li>
      <li className="py-4">
        <a href="/hospital/admin/diagnosis">Diagnosis</a>
      </li>
      <li className="py-4">
        <a href="#" onClick={toggleDoctorMenu}>
          Doctor
          {showDoctorMenu ? " ▲" : " ▼"}
        </a>
        {showDoctorMenu && (
          <ul>
            <li>
              <a className="text-base" href="/hospital/admin/doctor/add">
                - Add Doctor
              </a>
            </li>
            <li>
              <a className="text-base" href="/hospital/admin/doctor/manage">
                - Manage Doctor
              </a>
            </li>
          </ul>
        )}
      </li>
      <li className="py-4">
        <a href="#" onClick={toggleMedTechMenu}>
          Med Tech
          {showMedTechMenu ? " ▲" : " ▼"}
        </a>
        {showMedTechMenu && (
          <ul>
            <li>
              <a className="text-base" href="/hospital/admin/medtech/add">
                - Add Med Tech
              </a>
            </li>
            <li>
              <a className="text-base" href="/hospital/admin/medtech/manage">
                - Manage Med Tech
              </a>
            </li>
          </ul>
        )}
      </li>

      <li className="py-4">
        <a href="#" onClick={toggleNurseMenu}>
          Nurse
          {showNurseMenu ? " ▲" : " ▼"}
        </a>
        {showNurseMenu && (
          <ul>
            <li>
              <a className="text-base" href="/hospital/admin/nurse/add">
                - Add Nurse
              </a>
            </li>
            <li>
              <a className="text-base" href="/hospital/admin/nurse/manage">
                - Manage Nurse
              </a>
            </li>
          </ul>
        )}
      </li>
      <li className="py-4">
        <a href="#" onClick={toggleRadTechMenu}>
          Rad Tech
          {showRadTechMenu ? " ▲" : " ▼"}
        </a>
        {showRadTechMenu && (
          <ul>
            <li>
              <a className="text-base" href="/hospital/admin/radtech/add">
                - Add Rad Tech
              </a>
            </li>
            <li>
              <a className="text-base" href="/hospital/admin/radtech/manage">
                - Manage Rad Tech
              </a>
            </li>
          </ul>
        )}
      </li>
      <li className="py-4">
        <a href="/hospital/admin/staff/manage">Staff</a>
      </li>
      <li className="pt-16 underline">
        <button onClick={handleLogout}>Logout</button>
      </li>
    </>
  );
};

export default AdminNavigation;

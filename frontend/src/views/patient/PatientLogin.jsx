import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientLogin = () => {
  const [userRole, setUserRole] = useState("patient");
  const [loginIdentifier, setLoginIdentifier] = useState(""); // Use a single state variable
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    axios
      .post("http://localhost:5000/api/patient/login", { loginIdentifier, password })
      .then((res) => {
        localStorage.setItem("token", JSON.stringify(res.data));
        console.log("Logged in successfully");
        navigate("/");
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            // Unauthorized - Incorrect password
            toast.error("Incorrect password. Please try again.");
          } else if (err.response.status === 404) {
            // Not Found - Patient not found
            toast.error("Patient not found. Please check your login details.");
          } else {
            // Other status codes
            toast.error("An error occurred. Please try again later.");
          }
        } else if (err.request) {
          // No response received
          toast.error("No response received. Please try again later.");
        } else {
          // Something else went wrong
          toast.error("An unexpected error occurred.");
        }
      });
  };
  

  return (
    <>
      <div className="h-screen">
        <ToastContainer position="bottom-right"/>
        <Navbar userRole={userRole} />
        <div className="flex justify-center items-center">
          <form
            className="absolute top-1/4  shadow-2xl p-8 space-y-4 rounded-lg bg-slate-200"
            onSubmit={handleSubmit}
          >
            <h1 className="text-center font-bold text-2xl text-[#4867d6]">Login</h1>
            <div>
              <label className="block ml-2">Email or Mobile Number</label>
              <input
                className="p-4 rounded-full text-sm mt-2 w-full"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                type="text"
                placeholder="Enter your email or mobile number"
              />
            </div>
            <div>
              <label className="block ml-2">Password</label>
              <input
                className="p-4 rounded-full text-sm mt-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="text-xs text-right font-light">
              <a href="#" className="hover:text-slate-600">
                Forgot your password?
              </a>
            </div>

            <button className="w-full border p-2 rounded-full text-white bg-[#4867D6]">
              Submit
            </button>
            <p>
              Don't have an account? Register <a href="/register" className="text-[#4867D6]">
                 here
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default PatientLogin;

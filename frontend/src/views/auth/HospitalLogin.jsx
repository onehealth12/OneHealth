import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HospitalLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "Admin") {
      axios
        .post("https://onehealth-backend.onrender.com/api/admin/login", {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem("token", JSON.stringify(res.data));
          console.log("Login Successfully as Admin");
          navigate("/hospital/admin/dashboard");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              // Unauthorized - Incorrect password
              toast.error("Incorrect password. Please try again.");
            } else if (err.response.status === 404) {
              toast.error("Admin not found. Please check your login details.");
            } else {
              // Other status codes
              toast.error("Invalid login data. Try again.");
            }
          } else if (err.request) {
            // No response received
            toast.error("No response received. Please try again later.");
          } else {
            // Something else went wrong
            toast.error("An unexpected error occurred.");
          }
        });
    } else if (role === "Doctor") {
      axios
        .post("https://onehealth-backend.onrender.com/api/doctor/login", {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem("token", JSON.stringify(res.data));
          console.log("Login Successfully as Doctor");
          navigate("/hospital/doctor/");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              // Unauthorized - Incorrect password
              toast.error("Incorrect password. Please try again.");
            } else if (err.response.status === 404) {
              toast.error("Doctor not found. Please check your login details.");
            } else {
              // Other status codes
              toast.error("Invalid login data. Try again.");
            }
          } else if (err.request) {
            // No response received
            toast.error("No response received. Please try again later.");
          } else {
            // Something else went wrong
            toast.error("An unexpected error occurred.");
          }
        });
    } else if (role === "Nurse") {
      axios
        .post("https://onehealth-backend.onrender.com/api/nurse/login", {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem("token", JSON.stringify(res.data));
          console.log("Login Successfully as Nurse");
          navigate("/hospital/nurse");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              // Unauthorized - Incorrect password
              toast.error("Incorrect password. Please try again.");
            } else if (err.response.status === 404) {
              toast.error("Nurse not found. Please check your login details.");
            } else {
              // Other status codes
              toast.error("Invalid login data. Try again.");
            }
          } else if (err.request) {
            // No response received
            toast.error("No response received. Please try again later.");
          } else {
            // Something else went wrong
            toast.error("An unexpected error occurred.");
          }
        });
    } else if (role === "Med Tech") {
      axios
        .post("https://onehealth-backend.onrender.com/api/medTech/login", {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem("token", JSON.stringify(res.data));
          console.log("Login Successfully as Staff");
          navigate("/hospital/medtech/");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              // Unauthorized - Incorrect password
              toast.error("Incorrect password. Please try again.");
            } else if (err.response.status === 404) {
              toast.error(
                "Med Tech not found. Please check your login details."
              );
            } else {
              // Other status codes
              toast.error("Invalid login data. Try again.");
            }
          } else if (err.request) {
            // No response received
            toast.error("No response received. Please try again later.");
          } else {
            // Something else went wrong
            toast.error("An unexpected error occurred.");
          }
        });
    } else if (role === "Rad Tech") {
      axios
        .post("https://onehealth-backend.onrender.com/api/radTech/login", {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem("token", JSON.stringify(res.data));
          console.log("Login Successfully as Staff");
          navigate("/hospital/radtech/");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              // Unauthorized - Incorrect password
              toast.error("Incorrect password. Please try again.");
            } else if (err.response.status === 404) {
              toast.error(
                "Rad Tech not found. Please check your login details."
              );
            } else {
              // Other status codes
              toast.error("Invalid login data. Try again.");
            }
          } else if (err.request) {
            // No response received
            toast.error("No response received. Please try again later.");
          } else {
            // Something else went wrong
            toast.error("An unexpected error occurred.");
          }
        });
    } else if (role === "Staff") {
      axios
        .post("https://onehealth-backend.onrender.com/api/receptionist/login", {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem("token", JSON.stringify(res.data));
          console.log("Login Successfully as Staff");
          navigate("/hospital/receptionist/");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              // Unauthorized - Incorrect password
              toast.error("Incorrect password. Please try again.");
            } else if (err.response.status === 404) {
              toast.error(
                "Information Desk Staff not found. Please check your login details."
              );
            } else {
              // Other status codes
              toast.error("Invalid login data. Try again.");
            }
          } else if (err.request) {
            // No response received
            toast.error("No response received. Please try again later.");
          } else {
            // Something else went wrong
            toast.error("An unexpected error occurred.");
          }
        });
    }
  };
  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <ToastContainer position="bottom-right" />
        <form
          className="shadow-2xl p-8 space-y-4 rounded-lg bg-slate-200 w-[450px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center font-bold text-2xl text-[#4867d6]">
            Login
          </h1>
          <div>
            <label className="block ml-2">Email</label>
            <input
              className="p-4 rounded-full text-sm mt-2 w-full"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block ml-2">Password</label>
            <input
              className="p-4 rounded-full text-sm mt-2 w-full"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label className="block ml-2">User Role:</label>
            <select
              className="p-4 rounded-full text-sm mt-2 w-full"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Med Tech">Med Tech</option>
              <option value="Rad Tech">Rad Tech</option>
              <option value="Staff">Information Desk</option>
            </select>
          </div>
          <button className="w-full border p-2 rounded-full text-white bg-[#4867D6]">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default HospitalLogin;

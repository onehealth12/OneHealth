import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";

const ForgotAccount = () => {
  const [userRole, setUserRole] = useState("patient");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email,
    };
    axios
      .post(
        "https://onehealth-backend.onrender.com/api/patient/forgotPassword",
        payload
      )
      .then((res) => {
        console.log(res.data);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="h-screen">
        <Navbar userRole={userRole} />
        <div className="flex justify-center items-center">
          <form
            className="absolute top-1/4  shadow-2xl p-8 space-y-4 rounded-lg bg-slate-200"
            onSubmit={handleSubmit}
          >
            <h1 className="text-center font-bold text-2xl text-[#4867d6]">
              Forgot password
            </h1>
            <div>
              <label className="block ml-2">
                Enter your email to send reset password
              </label>
              <input
                className="p-4 rounded-full text-sm mt-2 w-full"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email "
              />
            </div>
            <button className="w-full border p-2 rounded-full text-white bg-[#4867D6]">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotAccount;

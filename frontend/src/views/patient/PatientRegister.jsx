import React from "react";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientRegister = () => {
  const [userRole, setUserRole] = useState("patient");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState("Male");
  const [birthday, setBirthday] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [landline, setLandline] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const payload = {
    firstName,
    lastName,
    email,
    sex,
    birthday,
    mobileNumber,
    landline,
    addressLine1,
    addressLine2,
    barangay,
    city,
    province,
    password,
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/patient/register", {
        ...payload,
      })
      .then(() => {
        console.log("Register success");
        navigate("/login");
      })
      .catch((err) => console.log("Error: " + err));
  };

  const handleInput = (e, setter, maxLength) => {
    const numericValue = e.target.value.replace(/[^0-9+]/g, "");

    const limitedValue = numericValue.slice(0, maxLength);

    setter(limitedValue);
  };
  return (
    <>
      <Navbar userRole={userRole} />
      <div className="flex justify-center">
        <div className="lg:w-2/3">
          <form className="mt-4 p-2" onSubmit={handleSubmit}>
            <h1 className="text-[#4867D6] font-bold text-2xl text-center mb-4">
              Register Form
            </h1>
            <div className="mt-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">
                <label className="ml-2"> First Name</label>
                <label className="ml-2"> Last Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border-2 border-slate-300 rounded-full p-2"
                  placeholder="Enter your First Name"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border-2 border-slate-300 rounded-full p-2"
                  placeholder="Enter your Last Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">
                <label className="ml-2"> Sex</label>
                <label className="ml-2"> Birthday</label>
                <select
                  type="text"
                  className="border-2 border-slate-300 rounded-full p-2"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="border-2 border-slate-300 rounded-full p-2"
                />
              </div>
              <div className="grid grid-cols-3 gap-x-2 gap-y-2 ">
                <label className="ml-2"> Email</label>
                <label className="ml-2"> Mobile Num.</label>
                <label className="ml-2"> Landline</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-slate-300 rounded-full p-2 text-xs"
                  placeholder="Enter your Email"
                />
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => handleInput(e, setMobileNumber, 13)}
                  className="border-2 border-slate-300 rounded-full p-2 text-xs"
                  placeholder="Enter Mobile #"
                />
                <input
                  type="tel"
                  value={landline}
                  onChange={(e) => handleInput(e, setLandline, 13)}
                  className="border-2 border-slate-300 rounded-full p-2 text-xs"
                  placeholder="Enter Landline #"
                />
              </div>
              <div className="mt-4">
                <h1 className="font-bold">Complete Address</h1>
                <div className="grid grid-cols-3 gap-x-2 gap-y-2 ">
                  <label className="ml-2"> Address Line 1</label>
                  <label className="ml-2"> Address Line 2</label>
                  <label className="ml-2"> Barangay</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="border-2 border-slate-300 rounded-full p-2 text-xs"
                    placeholder="Street Address"
                  />
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="border-2 border-slate-300 rounded-full p-2 text-xs"
                    placeholder="Apt, suite, etc."
                  />
                  <input
                    type="text"
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    className="border-2 border-slate-300 rounded-full p-2 text-xs"
                    placeholder="Enter Barangay"
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">
                  <label className="ml-2">City</label>
                  <label className="ml-2">Province</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border-2 border-slate-300 rounded-full p-2"
                    placeholder="Enter your City"
                  />
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="border-2 border-slate-300 rounded-full p-2"
                    placeholder="Enter your Province"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">
                <label className="ml-2"> Password</label>
                <label className="ml-2"> Confirm Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-slate-300 rounded-full p-2"
                  placeholder="Enter your Password"
                />
                <input
                  type="password"
                  className="border-2 border-slate-300 rounded-full p-2"
                  placeholder="Enter your Confirm Password"
                />
              </div>
            </div>
            <div className="text-center  text-white font-semibold mt-16">
              <button className="bg-[#4867D6] p-4 rounded-full w-full">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PatientRegister;

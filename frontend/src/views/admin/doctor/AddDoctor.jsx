import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AddDoctor = () => {
  const [userRole, setUserRole] = useState("admin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [signature, setSignature] = useState([])

  const tokenObject = JSON.parse(localStorage.getItem("token"));
  const token = tokenObject.token;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const notify = () => {

    toast.success("Created Successfully !", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 4500,
    });
    console.log('Notify')
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      email,
      password,
      specialization,
      licenseNumber,
      departmentName,
      signature
    };
    axios
      .post(
        "http://localhost:5000/api/admin/doctor/create",
        payload,
        headerToken
      )
      .then((res) => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setSpecialization("");
        setLicenseNumber("");
        setDepartmentName("");
        setSignature('')
        notify()
        
        setTimeout(() => {
          location.reload()
        }, 5000);
      })
      .catch((err) => console.log("Error: " + err));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/department/get")
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

    //handle and convert it in base 64
    const handleSignature = (e) => {
      const file = e.target.files[0];
      setFileToBase(file);
      console.log("handleSignature: ",file);
    };
  
    const setFileToBase = (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSignature(reader.result);
        console.log("setFileToBase: ", reader.result);
      };
    };
  return (
    <>
      <div className="w-screen flex">
      <ToastContainer/>
        <Sidebar userRole={userRole} />
        <div className="w-full">
          <h1 className="mt-8 font-bold text-center">Add New Doctor</h1>
          <div className="max-w-md mx-auto">
            <form
            encType="multipart/form-data"
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    First Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Last Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    License Number
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="License Number"
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Clinic Address
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Clinic Address"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Clinic Number
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Clinic Number"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Department
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => setDepartmentName(e.target.value)}
                  >
                    <option value="">Choose Department</option>
                    {departments.map((department) => (
                      <option key={department._id} value={department.name}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Specialization
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Specialization"
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Upload Signature
                  </label>
                  <input onChange={handleSignature}  type="file" name="signature"/>
                </div>
              </div>
              <div className="text-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDoctor;

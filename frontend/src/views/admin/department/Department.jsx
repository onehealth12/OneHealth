import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";

const Department = () => {
  const [userRole, setUserRole] = useState("admin");
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('')


  const tokenObject = JSON.parse(localStorage.getItem("token"));
  //Get token string only
  const token = tokenObject.token;
  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/department/get", headerToken)
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:5000/api/admin/department/create', {name}, headerToken)
          .then((res) => {
            setName('')
            console.log(res.data)
            window.location.reload()
          })
          .catch((err) => console.log(err))
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/admin/department/${id}`, headerToken)
          .then((res) => {
            window.location.reload()
          })
          .catch((err) => console.log(err))
  }

  const handleUpdate = (id) => {
    axios.delete(`http://localhost:5000/api/admin/department/${id}`, headerToken)
          .then((res) => {
            window.location.reload()
          })
          .catch((err) => console.log(err))
  }
  return (
    <>
      <div className="flex w-screen">
        <Sidebar userRole={userRole} />
        <div className=" w-full ml-8">
          <div>
            <h1 className="text-center text-2xl font-bold">
              Add new department
            </h1>
            <form className="p-4 text-center mt-4" onSubmit={handleSubmit}>
              <label>Deparment Name:</label>
              <input
                className="p-2 border border-black ml-8"
                type="text"
                placeholder="Create new department"
                onChange={(e) => setName(e.target.value)}
              />
              <button className="p-2 bg-[#4867D6] ml-16 rounded-md text-white">
                Create
              </button>
            </form>
          </div>
          <div className="mt-32">
            <h1>List of Departments</h1>
            <div className="p-4">
              <table className="w-full border">
                <thead>
                  <tr className="bg-[#4867D6] text-white">
                    <th className="border p-2">Department ID</th>
                    <th className="border p-2">Department Name</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.length === 0 ? (
                    <tr>
                      <td>No Department Data</td>
                    </tr>
                  ) : (
                    departments.map((department) => (
                      <tr key={department._id}>
                        <td className="border  text-center p-2">DEPT - {department._id}</td>
                        <td className="border  text-center p-2">{department.name}</td>
                        <td className="border  text-center p-2">
                          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleDelete(department._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  <tr></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Department;

import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";

const ManageRadTech = () => {
  const [userRole, setUserRole] = useState("admin");
  const [radTechs, setRadTechs] = useState([]);

  //Get token object
  const tokenObject = JSON.parse(localStorage.getItem("token"));

  //Get token string only

  const token = tokenObject.token;
  const username = tokenObject.name;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/radTech/get", headerToken)
      .then((res) => {
        setRadTechs(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/admin/radTech/${id}`, headerToken)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="flex">
        <Sidebar userRole={userRole} />
        <div className="w-full">
          <h1 className="text-center text-2xl font-bold">Manage Rad Tech</h1>
          <div className="mt-24">
            <h2 className="ml-4">List of Rad Tech</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-[#4867D6] text-white">
                  <th className="border p-2">Rad Tech ID</th>
                  <th className="border p-2">Rad Tech Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">License Number</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {radTechs.length === 0 ? (
                  <tr>
                    <td>No Rad Tech data available</td>
                  </tr>
                ) : (
                  radTechs.map((radTech) => (
                    <tr key={radTech._id}>
                      <td className="border  text-center p-2">RT - {radTech._id}</td>
                      <td className="border  text-center p-2">{radTech.firstName} {radTech.lastName}</td>
                      <td className="border  text-center p-2">
                        {radTech.email}
                      </td>
                      <td className="border  text-center p-2">{radTech.licenseNumber}</td>
                      <td className="border  text-center p-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleDelete(radTech._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageRadTech;

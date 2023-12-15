import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";

const ManageMedTech = () => {
  const [userRole, setUserRole] = useState("admin");
  const [medTechs, setMedTechs] = useState([]);

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
      .get("http://localhost:5000/api/admin/medTech/get", headerToken)
      .then((res) => {
        setMedTechs(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/admin/medTech/${id}`, headerToken)
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
          <h1 className="text-center text-2xl font-bold">Manage Med Tech</h1>
          <div className="mt-24">
            <h2 className="ml-4">List of Med Tech</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-[#4867D6] text-white">
                  <th className="border p-2">Med Tech ID</th>
                  <th className="border p-2">Med Tech Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">License Number</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {medTechs.length === 0 ? (
                  <tr>
                    <td>No Med Tech data available</td>
                  </tr>
                ) : (
                  medTechs.map((medTech) => (
                    <tr key={medTech._id}>
                      <td className="border  text-center p-2">MT - {medTech._id}</td>
                      <td className="border  text-center p-2">{medTech.firstName} {medTech.lastName}</td>
                      <td className="border  text-center p-2">
                        {medTech.email}
                      </td>
                      <td className="border  text-center p-2">{medTech.licenseNumber}</td>
                      <td className="border  text-center p-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleDelete(medTech._id)}>
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

export default ManageMedTech;

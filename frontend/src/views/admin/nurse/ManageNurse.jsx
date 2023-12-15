import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";

const ManageNurse = () => {
  const [userRole, setUserRole] = useState("admin");
  const [nurses, setNurses] = useState([]);

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
      .get("http://localhost:5000/api/admin/nurse/get", headerToken)
      .then((res) => {
        setNurses(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/admin/nurse/${id}`, headerToken)
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
          <h1 className="text-center text-2xl font-bold">Manage Nurses</h1>
          <div className="mt-24">
            <h2 className="ml-4">List of Nurses</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-[#4867D6] text-white">
                  <th className="border p-2">Nurse ID</th>
                  <th className="border p-2">Nurse Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">License Number</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {nurses.length === 0 ? (
                  <tr>
                    <td>No Nurse data available</td>
                  </tr>
                ) : (
                  nurses.map((nurse) => (
                    <tr key={nurse._id}>
                      <td className="border  text-center p-2">NUR - {nurse._id}</td>
                      <td className="border  text-center p-2">{nurse.firstName} {nurse.lastName}</td>
                      <td className="border  text-center p-2">
                        {nurse.email}
                      </td>
                      <td className="border  text-center p-2">{nurse.licenseNumber}</td>
                      <td className="border  text-center p-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleDelete(nurse._id)}>
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

export default ManageNurse;

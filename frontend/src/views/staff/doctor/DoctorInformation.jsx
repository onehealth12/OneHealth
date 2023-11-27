import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
const DoctorInformation = () => {
  const [userRole, setUserRole] = useState("receptionist");
  const [doctors, setDoctors] = useState([]);
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
      .get("http://localhost:5000/api/receptionist/doctor/get", headerToken)
      .then((res) => {
        setDoctors(res.data);
      });
  }, []);
  return (
    <>
      <div className="flex w-screen">
        <Sidebar userRole={userRole} />
        <div className=" w-full ml-8">
          <div>
            <h1 className="text-center text-2xl font-bold">
              Doctors Information
            </h1>
          </div>
          <div className="mt-32">
            <div className="p-4">
              <table className="w-full border">
                <thead>
                  <tr className="bg-[#4867D6] text-white">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Department</th>
                    <th className="border p-2">Specialization</th>
                    <th className="border p-2">Clinic Address</th>
                    <th className="border p-2">Clinic Number</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.length === 0 ? (
                    <tr>
                      <td>No data available</td>
                    </tr>
                  ) : (doctors.map((doctor) => (
                    <tr key={doctor._id}>
                    <td className="border  text-center p-2">{doctor.firstName} {doctor.lastName}</td>
                    <td className="border  text-center p-2">{doctor.dept_id.name}</td>
                    <td className="border  text-center p-2">
                      {doctor.specialization}
                    </td>
                    <td className="border  text-center p-2">123 Street</td>
                    <td className="border  text-center p-2">515-6322</td>
                  </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorInformation;

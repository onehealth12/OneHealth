import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDoctorModal from "../../../components/modals/EditDoctorModal";

const ManageDoctor = () => {
  const [userRole, setUserRole] = useState("admin");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showEditDoctor, setShowEditDoctor] = useState(false);
  const handleClose = () => setShowEditDoctor(false);
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  const token = tokenObject.token;
  const username = tokenObject.name;
  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/doctor/get", headerToken)
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const notify = () => {
    toast.success("Deleted Successfully !", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 4500,
    });
    console.log("Notify");
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/admin/doctor/${id}`, headerToken)
      .then((res) => {
        notify();

        setTimeout(() => {
          location.reload();
        }, 5000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="flex">
        <Sidebar userRole={userRole} />
        <ToastContainer />
        <div className="w-full p-8">
          <h1 className="text-center text-2xl font-bold mb-8">
            Manage Doctors
          </h1>
          <div className="mt-8">
            <h2 className="ml-4 mb-4">List of Doctors</h2>
            <div className="overflow-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="bg-[#4867D6] text-white">
                    <th className="border py-2 px-4">Doctor ID</th>
                    <th className="border py-2 px-4">Doctor Name</th>
                    <th className="border py-2 px-4">Department</th>
                    <th className="border py-2 px-4">Specialization</th>
                    <th className="border py-2 px-4">Email</th>
                    <th className="border py-2 px-4">Clinic Address</th>
                    <th className="border py-2 px-4">Clinic Number</th>
                    <th className="border py-2 px-4">License Number</th>
                    <th className="border py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-4 px-4 text-center">
                        No Doctors Data
                      </td>
                    </tr>
                  ) : (
                    doctors.map((doctor) => (
                      <tr key={doctor._id}>
                        <td className="py-2 px-4">DOC-{doctor._id}</td>
                        <td className="py-2 px-4">
                          {doctor.firstName} {doctor.lastName}
                        </td>
                        <td className="py-2 px-4">{doctor.dept_id.name}</td>
                        <td className="py-2 px-4">{doctor.specialization}</td>
                        <td className="py-2 px-4">{doctor.email}</td>
                        <td className="py-2 px-4"></td>
                        <td className="py-2 px-4"></td>
                        <td className="py-2 px-4">{doctor.licenseNumber}</td>
                        <td className="py-2 px-4  flex">
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowEditDoctor(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded"
                            onClick={() => handleDelete(doctor._id)}
                          >
                            Delete
                          </button>
                          <EditDoctorModal
                            doctor={selectedDoctor}
                            visible={showEditDoctor}
                            onClose={() => {
                              setSelectedDoctor(null);
                              setShowEditDoctor(false);
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageDoctor;

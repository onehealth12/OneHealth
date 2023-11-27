import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../store";
import ViewPatientModal from "../../components/modals/ViewPatientModal";

const DocHistory = () => {
  const [userRole, setUserRole] = useState("doctor");
  const [showViewPatient, setShowViewPatient] = useState(false);
  const handleClose = () => setShowViewPatient(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { appointments, getTodaysAppointments, getAllTimeAppointments } =
    useStore();
  const [activeTab, setActiveTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Get token object
    const tokenObject = JSON.parse(localStorage.getItem("token"));
    const token = tokenObject.token;

    // Fetch appointments and update the store
    if (activeTab === "today") {
      getTodaysAppointments(token);
    } else if (activeTab === "allTime") {
      getAllTimeAppointments(token);
      console.log("getall", appointments);
    }
  }, [activeTab, getAllTimeAppointments]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  console.log("get", appointments);
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientId.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      appointment.appt_status.toLowerCase() === "done"
  );

  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateA = new Date(a.appointmentDateTime);
    const dateB = new Date(b.appointmentDateTime);
    return dateB - dateA;
  });
  

  return (
    <div className="h-screen">
      <Navbar userRole={userRole} />
      <div>
        <div className="bg-white p-4">
          <div>
            <h1 className="text-center text-2xl text-[#4867D6] font-bold">
              Appointment History
            </h1>
          </div>
          <div className="mt-4">
            <div className="mt-2 text-center overflow-x-auto">
              <input
                type="text"
                placeholder="Search by Patient Name"
                className="my-4 p-4 border rounded"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex justify-center space-x-4">
                <button
                  className={`${
                    activeTab === "today" ? "bg-[#4867D6] text-white" : ""
                  } px-4 py-2 rounded border border-[#4867D6]`}
                  onClick={() => handleTabChange("today")}
                >
                  Today
                </button>
                <button
                  className={`${
                    activeTab === "allTime" ? "bg-[#4867D6] text-white" : ""
                  } px-4 py-2 rounded border border-[#4867D6]`}
                  onClick={() => handleTabChange("allTime")}
                >
                  All Time
                </button>
              </div>
              <table className="w-full border-collapse border text-sm mx-auto">
                <thead className="text-xs bg-grey-300 uppercase bg-gray-50">
                  <tr className="text-white text-center">
                    <th className="py-6 px-6 bg-[#4867D6]">Date</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Time</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Patient Name</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Appointment ID</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Diagnosis</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Status</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="7">No data</td>
                    </tr>
                  ) : (
                    sortedAppointments.map((appointment) => (
                      <tr className="text-center" key={appointment._id}>
                        <td className="py-3 px-6">
                          {new Date(
                            appointment.appointmentDateTime
                          ).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6">
                          {new Date(
                            appointment.appointmentDateTime
                          ).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-6">
                          {appointment.patientId.firstName}{" "}
                          {appointment.patientId.lastName}
                        </td>
                        <td className="py-3 px-6">{appointment._id}</td>
                        <td className="py-3 px-6">
                          {appointment.diagnosis
                            ? appointment.diagnosis.name
                            : "No Diagnosis"}
                        </td>
                        <td className="py-3 px-6">{appointment.appt_status}</td>
                        <td className="py-3 px-6">
                          <button
                            className="bg-[#4867D6] text-white px-3 py-1 rounded-md mr-4"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowViewPatient(true);
                            }}
                          >
                            View Patient
                          </button>
                          <ViewPatientModal
                            appointment={selectedAppointment}
                            visible={showViewPatient}
                            onClose={() => {
                              setSelectedAppointment(null);
                              setShowViewPatient(false);
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
    </div>
  );
};

export default DocHistory;

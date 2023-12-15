import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../store";
import AddPrescriptionModal from "../../components/modals/AddPrescriptionModal";
import Diagnose from "../../components/modals/Diagnose";
import { GrLinkNext } from "react-icons/gr";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const DocTracker = () => {
  const [userRole, setUserRole] = useState("doctor");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showDiagnose, setShowDiagnose] = useState(false);
  const handleClose = () => setShowDiagnose(false);
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] =
    useState(false);
  const handleOnClose = () => setShowAddPrescriptionModal(false);
  const { appointments, getTodaysAppointments, updateAppointmentStatus } =
    useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [info, setInfo] = useState([])
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  const token = tokenObject.token;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    axios.get("http://localhost:5000/api/doctor/get", headerToken)
    .then((res) => {
      setInfo(res.data)
    })
    .catch((err) => console.log("Error: ") + err)

    getTodaysAppointments(token);
    
    // Set up Socket.IO event listeners
    socket.on("appointmentUpdated", (updatedAppointment) => {
      // Handle the updated appointment, you might want to update the state or perform other actions
      console.log("Appointment Updated:", updatedAppointment);
      getTodaysAppointments(token); // Refresh appointments after an update
    });

    // Clean up the Socket.IO event listener on component unmount
    return () => {
      socket.off("appointmentUpdated");
    };
  }, [getTodaysAppointments]);

  // Filter appointments based on search query and exclude appointments with status 'Done'
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientId.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      appointment.appt_status !== "Done" &&
      appointment.appt_status !== "Upcoming"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} />

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-[#4867D6] text-center mb-4">
          Patient Status (Doctor)
        </h1>

        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search by Patient Name"
            className="px-4 py-2 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <table className="w-full border-collapse border">
          <thead className="bg-[#4867D6] text-white">
            <tr>
              <th className="py-4">Patient Name</th>
              <th className="py-4">Status</th>
              <th className="py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td>No Appointment for today</td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="text-center">
                  <td className="p-2">
                    {appointment.patientId.firstName}{" "}
                    {appointment.patientId.lastName}
                  </td>
                  <td>{appointment.appt_status}</td>
                  <td>
                    {appointment.appt_status === `Consultation with Dr. ${info.firstName} ${info.lastName}` && (
                      <div>

                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-md mx-1"
                          onClick={() => {
                            setSelectedAppointmentId(appointment._id);
                            setShowDiagnose(true);
                          }}
                        >
                          Diagnose
                        </button>
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-md mr-4"
                          onClick={() => {
                            setSelectedAppointmentId(appointment._id);
                            setShowAddPrescriptionModal(true);
                          }}
                        >
                          Prescription
                        </button>
                        <Diagnose
                          token={headerToken}
                          id={selectedAppointmentId}
                          visible={showDiagnose}
                          onClose={() => {
                            setSelectedAppointmentId(null);
                            setShowDiagnose(false);
                          }}
                        />
                        <AddPrescriptionModal
                          id={selectedAppointmentId}
                          visible={showAddPrescriptionModal}
                          onClose={() => {
                            setSelectedAppointmentId(null);
                            setShowAddPrescriptionModal(false);
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocTracker;

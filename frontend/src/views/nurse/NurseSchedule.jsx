import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../store";
import UploadFile from "../../components/modals/UploadFile";
import io from "socket.io-client";
const socket = io("http://localhost:5000"); 
import { GrLinkNext } from "react-icons/gr";

const NurseSchedule = () => {
  const [userRole, setUserRole] = useState("nurse");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const handleClose = () => setShowUpload(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { appointments, getAllTodaysAppointments, updateAppointmentStatus } =
    useStore();

    useEffect(() => {
      const tokenObject = JSON.parse(localStorage.getItem("token"));
      const token = tokenObject.token;
      getAllTodaysAppointments(token);
  
      // Set up Socket.IO event listeners
      socket.on("appointmentUpdated", (updatedAppointment) => {
        // Handle the updated appointment, you might want to update the state or perform other actions
        console.log("Appointment Updated:", updatedAppointment);
        getAllTodaysAppointments(token); // Refresh appointments after an update
      });
  
      // Clean up the Socket.IO event listener on component unmount
      return () => {
        socket.off("appointmentUpdated");
      };
    }, [getAllTodaysAppointments]);

  const handleUpdate = (id, currentStatus) => {
    let nextStatus;

    switch (currentStatus) {
      case "Upcoming":
        nextStatus = "Reception";
        break;
      case "Reception":
        nextStatus = "Assessment";
        break;
      case "Assessment":
        nextStatus = "Testing";
        break;
      case "Testing":
        nextStatus = "Consultation";
        break;
      case "Consultation":
        nextStatus = "Done";
        break;
      default:
        return;
    }

    updateAppointmentStatus(id, nextStatus);
  };



  const receptionAppointments = appointments.filter(
    (appointment) => appointment.appt_status === "Reception"
  );
  const assessmentAppointments = appointments.filter(
    (appointment) => appointment.appt_status === "Assessment"
  );
  const testingAppointments = appointments.filter(
    (appointment) => appointment.appt_status === "Testing"
  );

  const consultationAppointments = appointments.filter(
    (appointment) => appointment.appt_status === "Consultation"
  );

  // Filter appointments based on search query and exclude appointments with status 'Done'
const filteredAppointments = appointments.filter(appointment =>
  appointment.patientId.firstName.toLowerCase().includes(searchQuery.toLowerCase()) &&
  appointment.appt_status !== "Done" && appointment.appt_status !== "Upcoming"
);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} />

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-[#4867D6] text-center mb-4">
          Patient Status (Nurse)
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
              <th className="py-4">Doctor Name</th>
              <th className="py-4">Reception</th>
              <th className="py-4">Assessment</th>
              <th className="py-4">Testing</th>
              <th className="py-4">Consultation</th>
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
                    {appointment.patientId.firstName} {appointment.patientId.lastName}
                  </td>
                  <td className="p-2">
                    {appointment.doctorId.firstName}{" "}
                    {appointment.doctorId.lastName}
                  </td>


                  <td className="p-2" key={`reception-${appointment._id}`}>
                    {receptionAppointments.map((receptionAppt) => {
                      if (receptionAppt._id === appointment._id) {
                        return (
                          <div className="bg-blue-100 p-3 border border-blue-300 rounded-md flex items-center justify-between">
                            <span className="text-blue-700 font-semibold">
                              In Progress
                            </span>
                            <button
                              className="text-white px-3 py-1 rounded-md"
                              onClick={() =>
                                handleUpdate(appointment._id, "Reception")
                              }
                            >
                              <GrLinkNext />
                            </button>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </td>

                  <td className="p-2" key={`assessment-${appointment._id}`}>
                    {assessmentAppointments.map((assessmentAppt) => {
                      if (assessmentAppt._id === appointment._id) {
                        return (
                          <div className="bg-blue-100 p-3 border border-blue-300 rounded-md flex items-center justify-between">
                            <span className="text-blue-700 font-semibold">
                              In Progress
                            </span>
                            <button
                              className="text-white px-3 py-1 rounded-md"
                              onClick={() =>
                                handleUpdate(appointment._id, "Assessment")
                              }
                            >
                              <GrLinkNext />
                            </button>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </td>

                  <td className="p-2" key={`testing-${appointment._id}`}>
                    {testingAppointments.map((testingAppt) => {
                      if (testingAppt._id === appointment._id) {
                        return (
                          <div className="bg-blue-100 p-3 border border-blue-300 rounded-md flex items-center justify-between">
                            <span className="text-blue-700 font-semibold">
                              In Progress
                            </span>
                            <div>
                              <button
                                className="bg-[#4867D6] text-white px-3 py-1 rounded-md mr-4"
                                onClick={() => {
                                  setSelectedAppointmentId(appointment._id);
                                  setShowUpload(true);
                                }}
                              >
                                Lab Result
                              </button>
                              <button
                                className="text-white px-3 py-1 rounded-md"
                                onClick={() =>
                                  handleUpdate(appointment._id, "Testing")
                                }
                              >
                                <GrLinkNext />
                              </button>
                            </div>
                            <UploadFile
                              id={selectedAppointmentId}
                              visible={showUpload}
                              onClose={() => {
                                setSelectedAppointmentId(null);
                                setShowUpload(false);
                              }}
                            />
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </td>

                  <td className="p-2" key={`consultation-${appointment._id}`}>
                    {consultationAppointments.map((consultationAppt) => {
                      if (consultationAppt._id === appointment._id) {
                        return (
                          <div className="bg-blue-100 p-3 border border-blue-300 rounded-md flex items-center justify-between">
                            <span className="text-blue-700 font-semibold">
                              In Progress
                            </span>
                            <div></div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
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

export default NurseSchedule;

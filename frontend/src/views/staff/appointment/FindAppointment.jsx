import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import { useReceptionistStore, useStore } from "../../../store";
import io from "socket.io-client"; // Import the socket.io-client library

const socket = io("https://onehealth-backend.onrender.com"); 

const FindAppointment = () => {
  const [userRole, setUserRole] = useState("receptionist");
  const { getAllTodaysAppointments, appointments } = useReceptionistStore();
  const { updateAppointmentStatus } = useStore();

  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientId.firstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.appt_status === "Reception" ||
      appointment.appt_status === "Upcoming"
  );

  const formatTime = (date) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const sortedStatusOrder = ["Upcoming", "Reception", "Assessment", "Testing", "Consultation"];

  const compareStatus = (a, b) => {
    const indexA = sortedStatusOrder.indexOf(a);
    const indexB = sortedStatusOrder.indexOf(b);
  
    return indexA - indexB;
  };
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const statusA = a.appt_status;
    const statusB = b.appt_status;
  
    return compareStatus(statusA, statusB);
  });
  return (
    <>
      <div className="flex h-screen">
        <Sidebar userRole={userRole} />
        <div className=" w-full ml-8">
          <div className="flex flex-col items-center">
            <h1 className="text-center text-2xl font-bold">
              Appointments for today
            </h1>
            <div className="flex mt-4">
              <input
                type="text"
                className="block px-4 py-2 text-sky-700 bg-white border rounded-full focus:border-sky-400 focus:ring-sky-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="">
          <div className=" overflow-y-auto max-h-[600px]">
              <table className="w-full border-collapse border text-sm mx-auto">
                <thead className="text-xs bg-grey-300 uppercase bg-gray-50 sticky top-0">
                  <tr className="text-white text-center">
                    <th className="py-6 px-6 bg-[#4867D6]">Date</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Time</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Appointment ID</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Patient Name</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Doctor Name</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Department</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Status</th>
                    <th className="py-6 px-6 bg-[#4867D6]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAppointments.length === 0 ? (
                    <tr>
                      <td>No data</td>
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
                        {formatTime(new Date(appointment.appointmentDateTime))}
                        </td>
                        <td className="py-3 px-6">{appointment._id}</td>
                        <td className="py-3 px-6">
                          {appointment.patientId.firstName}{" "}
                          {appointment.patientId.lastName}
                        </td>
                        <td className="py-3 px-6">
                        {appointment.doctorId && appointment.doctorId.firstName}{" "}
        {appointment.doctorId && appointment.doctorId.lastName}
                        </td>
                        <td className="py-3 px-6">
                        {appointment.doctorId && appointment.doctorId.dept_id && appointment.doctorId.dept_id.name}
                        </td>
                        <td className="py-3 px-6">{appointment.appt_status}</td>
                        <td className="p-2" key={`upcoming-${appointment._id}`}>
                          {["Upcoming", "Reception"].includes(
                            appointment.appt_status
                          ) && (
                            <button
                              className="bg-[#4867D6] text-white px-3 py-1 rounded-md"
                              onClick={() =>
                                handleUpdate(
                                  appointment._id,
                                  appointment.appt_status
                                )
                              }
                            >
                              Update
                            </button>
                          )}
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

export default FindAppointment;

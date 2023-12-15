import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../store";
import io from "socket.io-client";
const socket = io("http://localhost:5000"); 


const RadTechTracker = () => {
  const [userRole, setUserRole] = useState("radTech");
  const [searchQuery, setSearchQuery] = useState("");

  const { appointments, getAllTodaysAppointments } =
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
          Patient Status (Rad Tech)
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
              <th className="py-4">Status</th>
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
                  <td className="p-2">
                    {appointment.appt_status}
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

export default RadTechTracker;

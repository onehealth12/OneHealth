import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { usePatientStore } from "../../store";
import AppointmentList from "./AppointmentList";
import AppointmentDetails from "./AppointmentDetails";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

const PatientDashboard = () => {
  const [userRole, setUserRole] = useState("patient");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  //Get token object
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  //Get token string only
  const token = tokenObject ? tokenObject.token : null;

  useEffect(() => {
    if (token === null) {
      // Redirect to another page or handle the case when token is null
      window.location = "/login"; // Replace "/login" with the desired redirect path
    }
  }, [token]);

  const username = tokenObject ? tokenObject.name : null;

  const { getAppointments, appointments } = usePatientStore();

  useEffect(() => {
    getAppointments(token);
    
    socket.on("patientRealTimeAppointments", (updatedAppointment) => {
      // Handle the updated appointment, you might want to update the state or perform other actions
      getAppointments(token); // Refresh appointments after an update
    });

    return () => {
      socket.off("patientRealTimeAppointments");
    };
  }, []);



  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <>
      <Navbar userRole={userRole} />
      <header className="pt-10 max-w-xs mx-auto">
        <h1 className="text-2xl  font-semibold text-[#4867D6] text-center">
          {username}'s Appointment
        </h1>
      </header>
      <section className="pt-10 px-4 grid grid-cols-1 md:grid-cols-2 md:gap-x-2">
        <AppointmentList appointments={appointments} onAppointmentClick={handleAppointmentClick}/>
        <AppointmentDetails  selectedAppointment={selectedAppointment}/>
      </section>
    </>
  );
};

export default PatientDashboard;

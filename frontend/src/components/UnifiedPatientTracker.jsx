import React, { useState, useEffect } from "react";
import axios from "axios";

import io from "socket.io-client"; // Import the socket.io-client library
import { useReceptionistStore } from "../store";

const socket = io("https://onehealth-backend.onrender.com");

const UnifiedPatientTracker = () => {
  const { getAllTodaysAppointments, appointments } = useReceptionistStore();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  useEffect(() => {
    getAllTodaysAppointments();
    socket.on("appointmentUpdated", (updatedAppointment) => {
      // Handle the updated appointment, you might want to update the state or perform other actions
      console.log("Appointment Updated:", updatedAppointment);
      getAllTodaysAppointments(); // Refresh appointments after an update
    });

    // Clean up the Socket.IO event listener on component unmount
    return () => {
      socket.off("appointmentUpdated");
    };
  }, [getAllTodaysAppointments]);

  const getFilteredAppointments = (status) => {
    return appointments.filter((appointment) => {
      if (status === "Consultation with Doctor") {
        // Check if appt_status contains the substring "Consultation with Dr."
        return appointment.appt_status.includes("Consultation with Dr.");
      } else {
        return appointment.appt_status === status;
      }
    });
  };

  useEffect(() => {
    axios
      .get("https://onehealth-backend.onrender.com/api/department/get")
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      axios
        .get(
          `https://onehealth-backend.onrender.com/api/doctor/department/${selectedDepartment}`
        )
        .then((res) => {
          setDoctors(res.data);
        })
        .catch((err) => {
          console.error(err);
          setDoctors([]); // Set doctors to an empty array in case of an error
        });
    } else {
      // If no department is selected, reset the doctors state
      setDoctors([]);
    }
  }, [selectedDepartment]);

  const filterAppointments = () => {
    let filteredAppointments = getFilteredAppointments(
      "Consultation with Doctor"
    );

    if (selectedDepartment) {
      setFilteredConsultations([]);
      filteredAppointments = filteredAppointments.filter(
        (appointment) => appointment.doctorId.dept_id._id === selectedDepartment
      );
    }

    if (selectedDoctor) {
      filteredAppointments = filteredAppointments.filter(
        (appointment) => appointment.doctorId._id === selectedDoctor
      );
    }

    if (selectedDoctor && !selectedDepartment) {
      // If a doctor is selected without a department, reset both doctor and consultations
      setSelectedDoctor("");
      setFilteredConsultations([]);
    }

    // Update the state with filtered appointments
    setFilteredConsultations(filteredAppointments);
  };

  // Use the useEffect hook to update filtered appointments when the selected values change
  useEffect(() => {
    filterAppointments();
  }, [selectedDepartment, selectedDoctor, appointments]);
  return (
    <div className="main-container h-full flex flex-col space-y-2 ">
      <h1 className="font-bold text-center text-3xl">
        Unified Patient Tracker
      </h1>
      <div className="sub-container h-1/2 grid grid-cols-3 gap-2 px-4 ">
        {/* In Reception Area */}
        <div className="bg-white rounded-lg shadow-2xl border h-full overflow-y-auto">
          <h1 className="text-center font-semibold">In Reception Area</h1>
          {getFilteredAppointments("In Reception Area").length > 0 ? (
            <ul className=" space-y-2">
              {getFilteredAppointments("In Reception Area").map(
                (appointment) => (
                  <li
                    className="list-none mx-2 text-white grid grid-cols-2 bg-green-500 text-xl p-2 text-center"
                    key={appointment._id}
                  >
                    <p>
                      {appointment.patientId.firstName}{" "}
                      {appointment.patientId.lastName}
                    </p>
                    <p>Ongoing</p>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-center">No current patient.</p>
          )}
        </div>

        {/* Medical Technologist's Evaluation */}
        <div className="bg-white rounded-lg shadow-2xl border overflow-y-auto">
          <h1 className="text-center font-semibold">
            Medical Technologist's Evaluation
          </h1>
          {getFilteredAppointments("Medical Technologist's Evaluation").length >
          0 ? (
            <ul className=" space-y-2">
              {getFilteredAppointments("Medical Technologist's Evaluation").map(
                (appointment) => (
                  <li
                    className="list-none mx-2 text-white grid grid-cols-2 bg-green-500 text-xl p-2 text-center"
                    key={appointment._id}
                  >
                    <p>
                      {appointment.patientId.firstName}{" "}
                      {appointment.patientId.lastName}
                    </p>
                    <p>Ongoing</p>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-center">No current patient.</p>
          )}
        </div>

        {/* Radiologic Technologist's Imaging */}
        <div className="bg-white rounded-lg shadow-2xl border overflow-y-auto">
          <h1 className="text-center font-semibold">
            Radiologic Technologist's Imaging
          </h1>
          {getFilteredAppointments("Radiologic Technologist's Imaging").length >
          0 ? (
            <ul className=" space-y-2">
              {getFilteredAppointments("Radiologic Technologist's Imaging").map(
                (appointment) => (
                  <li
                    className="list-none mx-2 text-white grid grid-cols-2 bg-green-500 text-xl p-2 text-center"
                    key={appointment._id}
                  >
                    <p>
                      {appointment.patientId.firstName}{" "}
                      {appointment.patientId.lastName}
                    </p>
                    <p>Ongoing</p>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-center">No current patient.</p>
          )}
        </div>
      </div>
      <div className="sub-container h-1/2 grid grid-cols-2 gap-2 px-8">
        <div className="bg-white rounded-lg shadow-2xl border overflow-y-auto">
          <h1 className="text-center font-semibold">Assessment with Nurse</h1>
          {getFilteredAppointments("Nurse's Assessment").length > 0 ? (
            <ul className=" space-y-2">
              {getFilteredAppointments("Nurse's Assessment").map(
                (appointment) => (
                  <li
                    className="list-none mx-2 text-white grid grid-cols-2 bg-green-500 text-xl p-2 text-center"
                    key={appointment._id}
                  >
                    <p>
                      {appointment.patientId.firstName}{" "}
                      {appointment.patientId.lastName}
                    </p>
                    <p>Ongoing</p>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-center">No current patient.</p>
          )}
        </div>

        <div className=" bg-white rounded-lg shadow-2xl border flex flex-col overflow-y-auto">
          <div className="flex justify-center spa">
            <h1 className="text-center font-semibold">
              Consultation with Doctor
            </h1>
            <select
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
              className="border border-gray-300 bg-white"
            >
              <option value="">No Department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
            <select
              value={selectedDoctor}
              onChange={(event) => setSelectedDoctor(event.target.value)}
              className="border border-gray-300 bg-white"
            >
              <option value="">No Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>

          {filteredConsultations.length > 0 ? (
            <ul className=" space-y-2">
              {filteredConsultations.map((appointment) => (
                <li
                  className="list-none m-2 text-white grid grid-cols-3 bg-green-500 text-xl p-2 text-center"
                  key={appointment._id}
                >
                  <p>
                    {appointment.patientId.firstName}{" "}
                    {appointment.patientId.lastName}
                  </p>
                  <div>
                    <p>
                      Doctor:{" "}
                      {appointment.appt_status.replace(
                        "Consultation with Dr. ",
                        ""
                      )}
                    </p>
                    <p>{appointment.doctorId.dept_id.name}</p>
                  </div>
                  <p>Ongoing</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No current patient.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedPatientTracker;

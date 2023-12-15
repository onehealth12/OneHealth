import React, { useState } from "react";

const AppointmentList = ({ appointments, onAppointmentClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-white rounded md:shadow-2xl border ">
      <h1 className="text-3xl font-semibold text-center mb-6">Appointment List</h1>
      <ul className="space-y-4">
        {currentAppointments.map((appointment) => (
          <li key={appointment.id} className="flex justify-between cursor-pointer hover:bg-sky-300 items-center border-b pb-2" onClick={() => onAppointmentClick(appointment)}>
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Date/Time:</span>{" "}
                {new Date(appointment.appointmentDateTime).toLocaleDateString()}{" "}
                {formatTime(appointment.appointmentDateTime)}
              </p>
              <p className="text-lg font-semibold">
                <span className="font-semibold">Doctor:</span> Dr. {appointment.doctorId?.firstName}{" "}
                {appointment.doctorId?.lastName}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <Pagination
        appointmentsPerPage={appointmentsPerPage}
        totalAppointments={appointments.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ appointmentsPerPage, totalAppointments, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAppointments / appointmentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="flex">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`mx-1 ${
              number === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-full cursor-pointer hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <a
              onClick={() => paginate(number)}
              href="#!"
              className="block px-3 py-2"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AppointmentList;

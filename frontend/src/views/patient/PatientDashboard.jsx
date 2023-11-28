import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"; // Import Socket.IO client
import { usePatientStore } from "../../store";
import ViewFilesModal from "../../components/modals/ViewFilesModal";

const PatientDashboard = () => {
  const [userRole, setUserRole] = useState("patient");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showViewFiles, setShowViewFiles] = useState(false)
  const handleClose = () => setShowViewFiles(false)
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
  }, []);

  // Initialize react-router's navigate function
  const navigate = useNavigate();

  // Function to handle opening the PDF in a new page
  const openPdfPage = (appointmentId) => {
    // Navigate to the PDF view page and pass appointment data via state
    navigate("/pdf", { state: { appointmentId: appointmentId } });
  };
  return (
    <>
      <Navbar userRole={userRole} />
      <header className="pt-14 max-w-xs mx-auto">
        <h1 className="text-2xl  font-semibold text-[#4867D6] pt-10 text-center">
          {username}'s Appointment
        </h1>
      </header>
      <section className="pt-10">
        <div className="overflow-auto">
          <table className=" text-sm mx-auto">
            <thead className="text-xs bg-grey-300 uppercase bg-gray-50">
              <tr className="text-white text-center">
                <th className="py-6 px-6 bg-[#4867D6]">Date</th>
                <th className="py-6 px-6 bg-[#4867D6]">Time</th>
                <th className="py-6 px-6 bg-[#4867D6]">Appointment ID</th>
                <th className="py-6 px-6 bg-[#4867D6]">Department</th>
                <th className="py-6 px-6 bg-[#4867D6]">Doctor's Name</th>
                <th className="py-6 px-6 bg-[#4867D6]">Reason</th>
                <th className="py-6 px-6 bg-[#4867D6]">Diagnosis</th>
                <th className="py-6 px-6 bg-[#4867D6]">Status</th>
                <th className="py-6 px-6 bg-[#4867D6]">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="12"
                    className="text-center text-lg font-semibold text-[#4867D6]"
                  >
                    No appointments available
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
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
                    <td className="py-3 px-6">APPT-{appointment._id}</td>
                    <td className="py-3 px-6">
                    {appointment.doctorId && appointment.doctorId.dept_id && appointment.doctorId.dept_id.name}
                    </td>
                    <td className="py-3 px-6">
                      Dr. {appointment.doctorId?.firstName}{" "}
                      {appointment.doctorId?.lastName}
                    </td>
                    <td className="py-3 px-6">{appointment.reason}</td>
                    <td className="py-3 px-6">{appointment.diagnosis?.name}</td>
                    <td className="py-3 px-6">{appointment.appt_status}</td>
                    <td className="py-3 px-6">
                      {appointment.appt_status === "Done" && (
                        <>
                          <button
                            className="bg-[#4867D6] text-white px-3 py-1 rounded-md mr-4"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowViewFiles(true);
                            }}
                          >
                            View Files
                          </button>
                          <ViewFilesModal
                            appointment={selectedAppointment}
                            visible={showViewFiles}
                            onClose={() => {
                              setSelectedAppointment(null);
                              setShowViewFiles(false);
                            }}
                          />
                          
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default PatientDashboard;

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useStore } from "../../store";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import { PieChart, Pie, Tooltip } from "recharts";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const DoctorDashboard = () => {
  const [userRole, setUserRole] = useState("doctor");
  const { appointments, getAllTimeAppointments } = useStore();
  const [isExportClicked, setIsExportClicked] = useState(false);

  const handleExportClick = () => {
    setIsExportClicked(true);
  };

  useEffect(() => {
    const tokenObject = JSON.parse(localStorage.getItem("token"));
    const token = tokenObject.token;
    getAllTimeAppointments(token);

    // Set up Socket.IO event listeners
    socket.on("doctorRealTimeAppointments", (updatedAppointment) => {
      // Handle the updated appointment, you might want to update the state or perform other actions
      getAllTimeAppointments(token); // Refresh appointments after an update
    });

    // Clean up the Socket.IO event listener on component unmount
    return () => {
      socket.off("doctorRealTimeAppointments");
    };
  }, [getAllTimeAppointments]);

  // Filter appointments with diagnosis name
  const appointmentsWithDiagnosis = appointments.filter(
    (appointment) => appointment.diagnosis && appointment.diagnosis.name
  );

  // Calculate diagnosis frequency
  const diagnosisFrequency = appointmentsWithDiagnosis.reduce(
    (acc, appointment) => {
      const diagnosisName = appointment.diagnosis.name;
      acc[diagnosisName] = (acc[diagnosisName] || 0) + 1;
      return acc;
    },
    {}
  );

  // Format data for the pie chart
  const pieChartData = Object.entries(diagnosisFrequency).map(
    ([diagnosisName, count]) => ({
      name: diagnosisName,
      value: count,
    })
  );

  // Check if pieChartData is empty
  const isPieChartDataEmpty = pieChartData.length === 0;

  // Sort the diagnoses by frequency in descending order
  const sortedDiagnoses = Object.entries(diagnosisFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sortedAppointments = [...appointments].sort((a, b) => {
    const startTimeA = new Date(a.start);
    const startTimeB = new Date(b.start);
    return startTimeA - startTimeB;
  });

  const today = new Date().toLocaleDateString();

  // Filter appointments for today excluding those with appt_status set to "Done"
  const appointmentsForToday = sortedAppointments.filter((appointment) => {
    const appointmentDate = new Date(
      appointment.appointmentDateTime
    ).toLocaleDateString();

    // Add a condition to check appt_status !== "Done"
    return appointmentDate === today && appointment.appt_status !== "Done";
  });

  const nextPatient =
    appointmentsForToday.length > 0 ? appointmentsForToday[0] : null;
  return (
    <div className="bg-gray-200 min-h-screen">
      <Navbar userRole={userRole} />
      {/* Container */}
      <section className=" p-2">
        <div className="flex gap-x-2 p-2 h-1/2">
          <div className="bg-white rounded-md w-1/5 flex items-center shadow-lg p-4">
            {appointmentsForToday.length === 0 ? (
              <p className="font-bold text-3xl text-center">
                No appointments for today{" "}
              </p>
            ) : (
              <p className="text-center">
                TOTAL NUMBER OF PATIENTS BOOKED FOR THE DAY:{" "}
                {appointmentsForToday.length}
              </p>
            )}
          </div>
          <div className="bg-white rounded-md w-2/5 shadow-lg p-4">
            <div className="w-full">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  start: "prev",
                  center: "title",
                  end: "next",
                }}
                aspectRatio={2}
              />
            </div>
          </div>
          <div className="bg-white rounded-md w-2/3 shadow-lg p-8">
            <p className="font-bold text-3xl text-center mb-6">
              NEXT PATIENT DETAILS
            </p>

            {nextPatient ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 mb-4">
                  <p>
                    Name: {nextPatient.patientId.firstName}{" "}
                    {nextPatient.patientId.lastName}
                  </p>
                  <p>Appointment ID: {nextPatient._id}</p>
                </div>

                <div className="grid grid-cols-3 gap-x-4 mb-4">
                  <p>
                    Birthday:{" "}
                    {nextPatient.patientId.birthday
                      ? new Date(
                          nextPatient.patientId.birthday
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not available"}
                  </p>

                  <p>Sex: {nextPatient.patientId.sex || "Not available"}</p>

                  <p>
                    Last Appointment:{" "}
                    {nextPatient.lastAppointment
                      ? new Date(
                          nextPatient.lastAppointment
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No previous appointments"}
                  </p>
                </div>

                <div className="grid grid-cols-1 mb-4">
                  <p className="">
                    Patient History:{" "}
                    {nextPatient.pastDiagnoses &&
                    nextPatient.pastDiagnoses.length > 0
                      ? nextPatient.pastDiagnoses.map((diagnosis, index) => (
                          <span
                            key={index}
                            className=" mx-2 bg-[#4867D6] text-white p-1"
                          >
                            {diagnosis}
                          </span>
                        ))
                      : "Not available"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center">No upcoming appointments for today</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 p-4 min-h-1/2">
          <div className="flex justify-center items-center bg-white shadow-lg rounded-md p-4 min-h-1/2">
            <div>
              <p className="font-bold text-3xl text-center">
                Your Monthly Diagnosis
              </p>
              <div className="text-center">
                {isPieChartDataEmpty ? (
                  <p>No data available for the pie chart</p>
                ) : (
                  <>
                    <table
                      id="diagnosisTable"
                      style={{ display: isExportClicked ? "table" : "none" }}
                    >
                      <thead>
                        <tr>
                          <th>Diagnosis Name</th>
                          <th>Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pieChartData.map((data, index) => (
                          <tr key={index}>
                            <td>{data.name}</td>
                            <td>{data.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>{" "}
                    <PieChart width={400} height={400}>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value" // Use dataKey instead of valueKey
                        label
                      />
                      <Tooltip />
                    </PieChart>
                    <ReactHTMLTableToExcel
                      id="exportButton"
                      className="p-2 text-white bg-[#4867D6]"
                      table="diagnosisTable"
                      filename={`diagnosis_data_${new Date().toISOString()}`}
                      sheet="Sheet"
                      buttonText="Export to Excel"
                      onClick={handleExportClick}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-md p-4">
              <p>Total Diagnoses: {appointmentsWithDiagnosis.length}</p>
              <p>Most Common Diagnosis: {sortedDiagnoses[0]?.[0] || "N/A"}</p>
              <p>
                Second Most Common Diagnosis: {sortedDiagnoses[1]?.[0] || "N/A"}
              </p>
              <p>
                Third Most Common Diagnosis: {sortedDiagnoses[2]?.[0] || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-md p-4">
            <h2 className="font-bold text-3xl text-center">
              APPOINTMENT TODAY
            </h2>
            {appointmentsForToday.length > 0 ? (
              <ul>
                {appointmentsForToday.map((appointment) => (
                  <li className="grid grid-cols-2" key={appointment._id}>
                    <p>
                      Name: {appointment.patientId.firstName}{" "}
                      {appointment.patientId.lastName}
                    </p>
                    <p>
                      Time:{" "}
                      {new Date(
                        appointment.appointmentDateTime
                      ).toLocaleTimeString()}
                    </p>
                    <hr className="my-2" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No appointments for today</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;

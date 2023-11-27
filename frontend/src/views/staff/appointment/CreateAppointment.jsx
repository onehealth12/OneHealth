import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../patient/datepicker.css";
import { setMinutes, setHours } from "date-fns";

const CreateAppointment = () => {
  const [userRole, setUserRole] = useState("receptionist");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [reason, setReason] = useState("Medical Check up");
  const [availableDates, setAvailableDates] = useState([]);
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 0), 8)
  );
  const [errorMessage, setErrorMessage] = useState("");
  const tokenObject = JSON.parse(localStorage.getItem("token"));

  const token = tokenObject.token;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/department/get")
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      axios
        .get(
          `http://localhost:5000/api/doctor/department/${selectedDepartment}`
        )
        .then((res) => {
          setDoctors(res.data);
        });
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDoctor) {
      axios
        .get(`http://localhost:5000/api/doctor/availability/${selectedDoctor}`)
        .then((res) => {
          // console.log(selectedDoctor);
          setAvailabilities(res.data);
          // console.log(res.data);
        });
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (availabilities.length > 0) {
      const validDateRange = availabilities
        .map((availability) => {
          const startDate = new Date(availability.start); // Convert the start date to a Date object
          const endDate = new Date(availability.end); // Convert the end date to a Date object
          const dates = [];
          for (
            let date = startDate;
            date <= endDate;
            date.setDate(date.getDate())
          ) {
            dates.push(new Date(date)); // Create a new Date object to avoid reference issues
          }
          return dates;
        })
        .flat()
        .filter((date) => date >= new Date()); // Filter out dates that are in the past

      setAvailableDates(validDateRange);
    }
  }, [availabilities]);

  const handleDateChange = (date) => {
    const selectedDate = new Date(date);

    setStartDate(selectedDate);
    setAppointmentDateTime(selectedDate);
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      patientFirstName,
      patientLastName,
      email,
      mobileNumber,
      patientId,
      doctorId: selectedDoctor,
      appointmentDateTime,
      reason,
    };

    axios
      .post(
        "http://localhost:5000/api/receptionist/appointment/create",
        payload
      )
      .then((res) => {
        setPatientId("");
        setPatientFirstName("");
        setPatientLastName("");
        setEmail("");
        setMobileNumber("");
        setSelectedDoctor("");
        setAppointmentDateTime("");
        // console.log(appointment);
        window.location = "/";
      })
      .catch((err) => console.log("Error: " + err))

    console.log(payload);
  };
  return (
    <>
      <div className="w-screen flex">
        <Sidebar userRole={userRole} />
        <div className="w-full">
          <h1 className="mt-8 font-bold text-center">Create New Appointment</h1>
          <div className="p-16 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-x-2">
                <div className="mb-4">
                  <label className="block">Patient ID:</label>
                  <input
                    className="border border-gray-300 p-2 w-full"
                    type="text"
                    placeholder="Enter Patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block">First Name:</label>
                  <input
                    className="border border-gray-300 p-2 w-full"
                    type="text"
                    placeholder="Enter your first name"
                    value={patientFirstName}
                    onChange={(e) => setPatientFirstName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Last Name:</label>
                  <input
                    className="border border-gray-300 p-2 w-full"
                    type="text"
                    placeholder="Enter your last name"
                    value={patientLastName}
                    onChange={(e) => setPatientLastName(e.target.value)}
                  />
                </div>
              </div>
              <h1 className=" text-sm italic"> &bull; Fill atleast one</h1>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="mb-4">
                  <label className="block">Email:</label>
                  <input
                    className="border border-gray-300 p-2 w-full"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Mobile Number:</label>
                  <input
                    className="border border-gray-300 p-2 w-full"
                    type="text"
                    placeholder="Enter your mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-2">
                <div className="mb-4">
                  <label className="block">Department:</label>
                  <select
                    value={selectedDepartment}
                    onChange={(event) =>
                      setSelectedDepartment(event.target.value)
                    }
                    className="border border-gray-300 p-2 w-full bg-white"
                  >
                    <option value="">Select a Department</option>
                    {departments.map((department) => (
                      <option key={department._id} value={department._id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label>Doctor:</label>
                  <select
                    value={selectedDoctor}
                    onChange={(event) => setSelectedDoctor(event.target.value)}
                    className="border border-gray-300 p-2 w-full bg-white"
                  >
                    <option value="">Select a Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2">
                <div className="mb-4">
                  <label className="block">Reason for Appointment</label>
                  <select
                    className="border border-gray-300 p-2 w-full bg-white"
                    type="text"
                    placeholder="Select reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="Medical Check-up">Medical Check-up</option>
                    <option value="Follow up Check-up">
                      Follow up Check-up
                    </option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block">
                    Date and Time:{" "}
                    <span className="text-xs font-semibold italic">
                      {" "}
                      (Choose a doctor first)
                    </span>
                  </label>
                  <DatePicker
                    includeTimes={[
                      new Date().setHours(8, 0, 0, 0),
                      new Date().setHours(9, 0, 0, 0),
                      new Date().setHours(10, 0),
                      new Date().setHours(11, 0),
                      new Date().setHours(13, 0),
                      new Date().setHours(14, 0),
                    ]}
                    filterTime={filterPassedTime}
                    selected={startDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/d h:mm aa"
                    includeDates={availableDates}
                    showTimeSelect
                    timeIntervals={60} // Set the time intervals as needed
                    minTime={new Date().setHours(8, 0, 0)} // 8:00 AM
                    maxTime={new Date().setHours(14, 0, 0)} // 2:00 PM
                    disabled={!selectedDoctor}
                    placeholderText="Select Date and Time "
                  />
                  <div className="text-red-500 text-sm mb-2">
                    {errorMessage}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  type="submit"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAppointment;

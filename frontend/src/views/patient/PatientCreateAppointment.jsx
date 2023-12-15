import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { setMinutes, setHours } from "date-fns";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const PatientCreateAppointment = () => {
  const [userRole, setUserRole] = useState("patient");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [appointmentDateTime, setAppointmentDateTime] = useState("");
  const [reason, setReason] = useState("Medical Check up");
  const [availableDates, setAvailableDates] = useState([]);
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 0), 8)
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [minTime, setMinTime] = useState(null);
  const [maxTime, setMaxTime] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
  const notify = () => {

    toast.success("Booked Successfully !", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 4500,
    });

  };

  const tokenObject = JSON.parse(localStorage.getItem("token"));

  const token = tokenObject ? tokenObject.token : null;

  useEffect(() => {
    if (token === null) {
      // Redirect to another page or handle the case when token is null
      window.location = "/login"; // Replace "/login" with the desired redirect path
    }
  }, [token]);

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
          setAvailabilities(res.data);
          
          // Extract unique days from the response
          const availableDays = [...new Set(res.data.flatMap(entry => entry.daysAvailability.map(day => day.day)))];
          setSelectedDays(availableDays);
  
          // Find minTime and maxTime
          let minTime = "23:59";
          let maxTime = "00:00";
  
          res.data.forEach(entry => {
            entry.daysAvailability.forEach(day => {
              // Compare and update minTime
              if (day.startTime < minTime) {
                minTime = day.startTime;
              }
  
              // Compare and update maxTime
              if (day.endTime > maxTime) {
                maxTime = day.endTime;
              }
            });
          });
  
          // Set minTime and maxTime in the state
          setMinTime(new Date(`2000/01/01 ${minTime}`));
          setMaxTime(new Date(`2000/01/01 ${maxTime}`));
  
        })
        .catch((err) => console.log("Error fetching doctor availability: " + err));
    }
  }, [selectedDoctor]);
  



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

    if (!appointmentDateTime) {
      setErrorMessage("Please select a date and time for the appointment.");
      return;
    }

    const appointment = {
      doctorId: selectedDoctor,
      appointmentDateTime,
      reason,
    };

    // console.log(appointment);

    axios
      .post(
        "http://localhost:5000/api/patient/appointment/create",
        appointment,
        headerToken
      )
      .then((res) => {
        setSelectedDoctor("");
        setAppointmentDateTime("");
        notify()

        setTimeout(() => {
          window.location = "/";
        }, 5000);
        
      })
      .catch((err) => console.log("Error: " + err));
  };


  const getFutureDatesForDay = (day) => {
    const today = new Date();
    const currentDayIndex = today.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = daysOfWeek.indexOf(day);
    
    let daysToAdd = dayIndex - currentDayIndex;
    if (daysToAdd < 0) daysToAdd += 7; // If the day is in the past, add 7 to get the next occurrence
    
    const futureDates = [];
    for (let i = 0; i < 4; i++) { // Adjust the loop limit as needed
      const date = new Date(today);
      date.setDate(today.getDate() + daysToAdd + 7 * i);
      futureDates.push(date);
    }

    return futureDates;
  };

  
  return (
    <>
      <Navbar userRole={userRole}/>
      <div className="flex justify-center items-center ">
        <ToastContainer/>
        <div className=" p-6 md:w-4/5">
          <h1 className="text-3xl font-semibold mb-4 text-center text-[#4867D6]">
            Book an Appointment
          </h1>
          <form onSubmit={handleSubmit}>
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
                  <option value="Follow up Check-up">Follow up Check-up</option>
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
                  filterTime={filterPassedTime}
                  selected={startDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/d h:mm aa"
                  includeDates={selectedDays.flatMap(getFutureDatesForDay)}
                  showTimeSelect
                  timeIntervals={60} // Set the time intervals as needed
                  minTime={minTime}
                  maxTime={maxTime}
                  disabled={!selectedDoctor}
                  placeholderText="Select Date and Time "
                />
                <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
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
    </>
  );
};

export default PatientCreateAppointment;
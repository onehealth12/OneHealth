import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ManageSchedule = () => {
  const [userRole, setUserRole] = useState("doctor");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availabilities, setAvailabilities] = useState([])

  const tokenObject = JSON.parse(localStorage.getItem("token"));
  const token = tokenObject.token;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const notify = () => {

    toast.success("New Availability !", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 4500,
    });
    console.log('Notify')
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/doctor/availability/get', headerToken)
      .then((res) => {
        const apiSelectedDays = res.data.flatMap((availability) =>
          availability.daysAvailability.map((day) => day.day)
        );
        setSelectedDays(apiSelectedDays);
        setAvailabilities(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log("Error: " + err));
  }, []); // Empty dependency array to fetch data only once on component mount

  const handleDayChange = (day) => {
    // If the day is in selectedDays, remove it; otherwise, add it
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
  };


  const handleSaveAvailability = () => {
    const existingAvailability = availabilities.length > 0;
    
    const createdAvailability = {
      daysAvailability: selectedDays.map((day) => ({
        day,
        startTime,
        endTime,
      })),
    };

    const updatedAvailability = {
      updatedAvailability: selectedDays.map((day) => ({
        day,
        startTime,
        endTime,
      })),
    };
  
    if (existingAvailability) {
      // If there are existing availabilities, update the first one (you may need to adjust this logic based on your requirements)
      const id = availabilities[0]._id; // This assumes you have an '_id' property in your availability object
  

      axios
        .put(`http://localhost:5000/api/doctor/availability/${id}`, updatedAvailability, headerToken)
        .then((res) => {
          notify()
          setTimeout(() => {
            location.reload()
          }, 5000);
        })
        .catch((err) => {
          console.error("Error updating availability:", err.message);
          // Handle the error as needed
        });
    } else {
      // If there are no existing availabilities, create a new one
      axios
        .post("http://localhost:5000/api/doctor/availability/create", createdAvailability, headerToken)
        .then((res) => {
          notify()
          setTimeout(() => {
            location.reload()
          }, 5000);
        })
        .catch((err) => {
          console.error("Error saving availability:", err.message);
          // Handle the error as needed
        });
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userRole={userRole} />
      <div className="p-6 max-w-2xl mx-auto mt-8 bg-white rounded shadow">
      <ToastContainer/>
        <h1 className="text-3xl font-bold text-[#4867D6] mb-6">
          Manage Availability
        </h1>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Days:
            </label>
            <div className="flex space-x-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  name="days"
                  value={day}
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayChange(day)}
                  className="mr-2"
                />
                {day}
              </label>
            ))}
          </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Start Time:
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              End Time:
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveAvailability}
            className="bg-[#4867D6] text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Save Availability
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageSchedule;

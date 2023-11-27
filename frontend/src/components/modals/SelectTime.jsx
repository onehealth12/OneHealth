import React, { useState } from 'react';
import axios from 'axios';

const SelectTime = ({ token, visible, onClose, onDelete, selectedDateInfo, initialStartTime = '', initialEndTime = '' }) => {
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  if (!visible) return null;

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleSubmit = () => {
    const headerToken = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const startDateTime = new Date(selectedDateInfo.startStr);
    const endDateTime = new Date(selectedDateInfo.endStr);
  
    // Extract time portion from input and set it to the date objects
    const startTimeArray = startTime.split(':');
    startDateTime.setHours(startDateTime.getHours() + parseInt(startTimeArray[0], 10), startTimeArray[1]);
  
    const endTimeArray = endTime.split(':');
    endDateTime.setHours(endDateTime.getHours() + parseInt(endTimeArray[0], 10), endTimeArray[1]);
  
    // Add 8 hours to the start and end times
    startDateTime.setHours(startDateTime.getHours());
    endDateTime.setHours(endDateTime.getHours());
  
    const eventObject = {
      title: "Availability",
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      eventTimezone: "Asia/Manila",
      allDay: false,
    };
  
    axios
      .post("http://localhost:5000/api/doctor/availability/create", eventObject, headerToken)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log("Error: " + err));
    console.log(eventObject);
    onClose();
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="modal-overlay fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="modal-container bg-white w-120 rounded-lg shadow-lg z-50 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="modal-header bg-[#4867D6] text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-semibold">Input Time</h2>
        </div>
        <div className="modal-content p-4">
        <h1>Selected Start Date: {selectedDateInfo && selectedDateInfo.startStr}</h1>
        <h1>Selected End Date: {selectedDateInfo && selectedDateInfo.endStr}</h1>
          <div className="mb-4">
            <label className="font-semibold">Start Time:</label>
            <input
            type="time"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={startTime}
            onChange={handleStartTimeChange}
          />
          </div>
          <div className="mb-4">
            <label className="font-semibold">End Time:</label>
            <input
            type="time"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={endTime}
            onChange={handleEndTimeChange}
          />
          </div>
        </div>
        <div className="modal-footer bg-gray-100 p-4 rounded-b-lg flex justify-between">
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectTime;

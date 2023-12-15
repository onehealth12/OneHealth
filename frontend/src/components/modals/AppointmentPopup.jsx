// AppointmentPopup.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AppointmentPopup = ({ appointmentId, onClose, role }) => {
  const [appointmentInfo, setAppointmentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/doctor/appointment/spec/${appointmentId}`
        );
        const appointmentData = response.data;

        setAppointmentInfo(appointmentData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointment information:", error);
        setLoading(false);
      }
    };

    fetchAppointmentInfo();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
        <div className="modal-container bg-white w-96 rounded-lg shadow-lg z-50 relative">
          <div className="modal-content p-4 space-y-2">
            <p className="mb-4">Loading appointment information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!appointmentInfo) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
        <div className="modal-container bg-white w-96 rounded-lg shadow-lg z-50 relative">
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
            <h2 className="text-2xl font-semibold">Error</h2>
          </div>
          <div className="modal-content p-4 space-y-2">
            <p>
              Something is wrong with your QR Code. Make sure that you are
              scanning a QR Code for this system
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="modal-container bg-white w-124 rounded-lg shadow-lg z-50 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
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
          <h2 className="text-2xl font-semibold">Patient Information</h2>
        </div>
        <div className="modal-content p-4 space-y-2">
          <p className="font-semibold">
            ID:
            <span className="ml-1 font-normal">
              {appointmentInfo._id || "No Data"}
            </span>
          </p>
          <p className="font-semibold">
            Name:{" "}
            <span className="ml-1 font-normal">
              {appointmentInfo.patientId.firstName || "No Data"}{" "}
              {appointmentInfo.patientId.lastName || "No Data"}
            </span>
          </p>

          <div className="grid grid-cols-2 gap-x-2">
            <p className="font-semibold">
              Date of Birth:
              <span className="ml-1 font-normal">
                {appointmentInfo.patientId.birthday
                  ? new Date(
                      appointmentInfo.patientId.birthday
                    ).toLocaleDateString()
                  : "No Data"}
              </span>
            </p>
            <p className="font-semibold">
              Sex:{" "}
              <span className="ml-1 font-normal">
                {appointmentInfo.patientId.sex || "No Data"}
              </span>
            </p>
          </div>

          <p className="font-semibold">
            Last Appointment:
            <span className="ml-1 font-normal">
              {appointmentInfo.lastAppointment
                ? new Date(appointmentInfo.lastAppointment).toLocaleDateString()
                : "No Data"}
            </span>
          </p>
          {role === "doctor" || role === "nurse" ? (
            <p className="font-semibold">
              Patient Past Diagnoses:{" "}
              {appointmentInfo.pastDiagnoses.length > 0
                ? appointmentInfo.pastDiagnoses.map((diagnosis, index) => (
                    <span
                      key={index}
                      className="bg-[#4867D6] ml-1 font-normal text-white px-2 py-1 rounded mr-2"
                    >
                      {diagnosis}
                    </span>
                  ))
                : "No Data"}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPopup;

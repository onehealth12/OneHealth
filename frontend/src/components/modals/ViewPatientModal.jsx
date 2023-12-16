import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ViewPatientModal = ({ visible, onClose, appointment }) => {
  if (!visible) return null;

  const navigate = useNavigate();

  const { _id, appointmentDateTime, labResult, pastDiagnoses } = appointment;

  const patientId = appointment.patientId._id;
  const { firstName, lastName, email, mobileNumber } = appointment.patientId;

  const openPdfPage = (_id) => {
    // Navigate to the PDF view page and pass appointment data via state
    navigate("/pdf", { state: { appointmentId: _id } });
  };
  console.log(appointment.labResult);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="bg-white w-1/2 rounded-lg shadow-lg z-50 relative">
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
        <div className="bg-[#4867D6] text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-semibold">Patient's Details</h2>
        </div>
        <div className="p-4 grid grid-cols-2">
          <p className="mb-2">
            <span className="font-semibold">Patient ID:</span> {patientId}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Name:</span> {firstName} {lastName}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Email:</span> {email}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Mobile Number:</span> {mobileNumber}
          </p>
          <p className="mb-2">
        <span className="font-semibold">Past Diagnoses:</span>{" "}
        {pastDiagnoses && pastDiagnoses.length > 0 ? (
          <ul>
            {pastDiagnoses.map((diagnosis, index) => (
              <li key={index}>{diagnosis}</li>
            ))}
          </ul>
        ) : (
          "No past diagnoses available"
        )}
      </p>
        </div>
        <div className="p-4">
          <label className="block text-lg font-semibold mb-2">
            Lab results:
          </label>
          {appointment.labResult && appointment.labResult.length > 0 ? (
            <div>
              {/* Display each lab result with improved styling */}
              {appointment.labResult.map((result, index) => (
                <p key={result._id} className="mb-2">
                  <a
                    href={result.labFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Laboratory Result {index + 1}
                  </a>
                </p>
              ))}
            </div>
          ) : (
            <p>No lab results available</p>
          )}
        </div>
        <div className="bg-gray-100 p-4 rounded-b-lg flex justify-center">
        {/* Conditionally render the button based on the presence of prescription */}
        {appointment.prescription ? (
          <button
            className="bg-[#4867D6] p-2 text-white rounded-sm mr-2"
            onClick={() => openPdfPage(_id)}
          >
            View Prescription
          </button>
        ) : (
          <button
            className="bg-[#4867D6] p-2 text-white rounded-sm mr-2"
            disabled
          >
            No Prescription Available
          </button>
        )}
      </div>
      </div>
    </div>
  );
};

export default ViewPatientModal;

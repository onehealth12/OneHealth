// Scanner.jsx
import React, { useState, useMemo } from "react";
import QrReader from "react-qr-scanner";
import { useStore } from "../store";
import AppointmentPopup from "./modals/AppointmentPopup";

const Scanner = ({ role, doctorFirstName, doctorLastName }) => {
  const { updateAppointmentStatus } = useStore();
  const [scanResult, setScanResult] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  // Get token object
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  // Get token string only
  const token = tokenObject ? tokenObject.token : null;
  const [shouldScan, setShouldScan] = useState(true);

  const handleScan = (data) => {
    if (data && shouldScan) {
      // Log the scanned data to the console
      console.log("QR Code Scanned:", data);

      // Determine the appointment status based on the role
      let appointmentStatus;
      switch (role) {
        case "doctor":
          appointmentStatus = `Consultation with Dr. ${doctorFirstName} ${doctorLastName}`;
          break;
        case "nurse":
          appointmentStatus = "Nurse's Assessment";
          break;
        case "receptionist":
          appointmentStatus = "In Reception Area";
          break;
        case "medTech":
          appointmentStatus = "Medical Technologist's Evaluation";
          break;
        case "radTech":
          appointmentStatus = "Radiologic Technologist's Imaging";
          break;
        default:
          appointmentStatus = "Unknown";
      }

      // Use the updateAppointmentStatus function to update status with the determined appointment status
      updateAppointmentStatus(data.text, appointmentStatus, token);
      setScanResult(data.text); // Only storing the 'text' property

      setShowPopup(true);

      setShouldScan(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    // Handle errors related to camera unavailability
    setCameraAvailable(false);
  };

  if (!cameraAvailable) {
    return <div className="text-center mt-4">Camera not available</div>;
  }

  const handleClosePopup = () => {
    setShowPopup(false);

    // Resume scanning when the popup is closed
    setShouldScan(true);
  };
  // Use useMemo to create a new key whenever shouldScan changes
  const qrKey = useMemo(
    () => Math.random().toString(36).substring(7),
    [shouldScan]
  );

  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <QrReader
        key={qrKey}
        onScan={handleScan}
        onError={handleError}
        style={{ width: "30%" }} // Adjust the width as needed
      />
      <h1 className="my-4 text-xl font-bold">Scan Patient's QR Code</h1>
      {scanResult && <p className="mt-4">Scanned result: {scanResult}</p>}
      {showPopup && (
        <AppointmentPopup
          role={role}
          appointmentId={scanResult}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Scanner;

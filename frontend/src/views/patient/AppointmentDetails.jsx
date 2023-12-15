import React from "react";
import QRCode from "qrcode.react"; // Import QRCode library
import { useNavigate } from "react-router-dom";
const AppointmentDetails = ({ selectedAppointment }) => {
  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const downloadQR = (appointmentId) => {
    const canvas = document.getElementById(appointmentId);
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "Appointment-QR.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  const navigate = useNavigate()

  const openPdfPage = (_id) => {
    console.log(_id)
    // Navigate to the PDF view page and pass appointment data via state
    navigate("/pdf", { state: { appointmentId: _id } });
  };
  return (
    <div className="container mx-auto my-8 p-8 bg-white rounded md:shadow-2xl break-words border">
      <h1 className="text-3xl text-center font-semibold mb-6">
        Appointment Details
      </h1>
      {selectedAppointment ? (
        <div className="grid grid-cols-1 gap-8">
          <div className="font-semibold grid grid-cols-1 gap-8 md:grid-cols-2">
            <p className="font-semibold">
              Appointment ID:{" "}
              <span className="block font-normal">
                {" "}
                {selectedAppointment._id}
              </span>
            </p>
            <p className="font-semibold">
              Date:{" "}
              <span className="block font-normal">
                {new Date(
                  selectedAppointment.appointmentDateTime
                ).toLocaleDateString()}{" "}
                {formatTime(selectedAppointment.appointmentDateTime)}
              </span>
            </p>
          </div>
          <div className="font-semibold grid grid-cols-1 gap-8 md:grid-cols-2">
            <p className="font-semibold">
              Department:{" "}
              <span className="block font-normal">
                {selectedAppointment.doctorId &&
                  selectedAppointment.doctorId.dept_id &&
                  selectedAppointment.doctorId.dept_id.name}
              </span>{" "}
            </p>
            <p className="font-semibold">
              Doctor:{" "}
              <span className="block font-normal">
                {selectedAppointment.doctorId?.firstName}{" "}
                {selectedAppointment.doctorId?.lastName}
              </span>{" "}
            </p>
          </div>
          <div className="font-semibold grid grid-cols-1 gap-8 md:grid-cols-2">
            <p className="font-semibold">
              Reason:{" "}
              <span className="block font-normal">
                {selectedAppointment.reason}
              </span>{" "}
            </p>
            <p className="font-semibold">
              Status:{" "}
              <span className="block font-normal">
                {selectedAppointment.appt_status}
              </span>{" "}
            </p>
          </div>
          <div className="font-semibold grid grid-cols-1 gap-8 md:grid-cols-2">
            <p className="font-semibold">
              Diagnosis:{" "}
              <span className="block font-normal">
                {selectedAppointment.diagnosis?.name}
              </span>{" "}
            </p>
            <p className="font-semibold">
              Diagnosis Notes:{" "}
              <span className="block font-normal">
                {selectedAppointment.diagnosisNotes}
              </span>{" "}
            </p>
          </div>
          <div className="font-semibold grid grid-cols-1 gap-8 md:grid-cols-2">
            <p className="font-semibold">
              Prescription:
              <span className="block font-normal">

                {selectedAppointment.prescription ? (
                  <button
                    className="bg-[#4867D6] p-1 text-white rounded-sm mr-2"
                    onClick={() => openPdfPage(selectedAppointment._id)}
                  >
                    View Prescription
                  </button>
                ) : (
                  <button
                    className="bg-[#4867D6] p-1 text-white rounded-sm mr-2"
                    disabled
                  >
                    No Prescription Available
                  </button>
                )}
              </span>
            </p>
            <p className="font-semibold">
              Lab Result:{" "}
              <span className="block font-normal">
                {selectedAppointment.labResult &&
                selectedAppointment.labResult.length > 0 ? (
                  <div>
                    {selectedAppointment.labResult.map((result, index) => (
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
              </span>{" "}
            </p>
            <p className="font-semibold">
              Appointment QR Code:{" "}
              <span className="">
                {" "}
                <QRCode
                  id={selectedAppointment._id}
                  value={selectedAppointment._id}
                  size={80}
                  level={"H"}
                  includeMargin={true}
                />
                <a
                  className="p-1 bg-[#4867D6] text-white"
                  onClick={() => downloadQR(selectedAppointment._id)}
                >
                  Download QR Code
                </a>
              </span>{" "}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          Select an appointment to view details
        </p>
      )}
    </div>
  );
};

export default AppointmentDetails;

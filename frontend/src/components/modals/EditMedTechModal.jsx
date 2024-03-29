import React, { useState } from "react";
import axios from "axios";

const EditMedTechModal = ({ visible, onClose, medTech, headerToken }) => {
  if (!visible) return null;
  const [editedMedTech, setEditedMedTech] = useState({
    id: medTech._id,
    firstName: medTech.firstName,
    lastName: medTech.lastName,
    email: medTech.email,
    licenseNumber: medTech.licenseNumber,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMedTech((prevMedTech) => ({
      ...prevMedTech,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { id, firstName, lastName, email, licenseNumber } = editedMedTech;

    const payload = {
      firstName,
      lastName,
      email,
      licenseNumber,
    };

    axios
      .put(
        `https://onehealth-backend.onrender.com/api/admin/medTech/${id}`,
        payload,
        headerToken
      )
      .then((res) => {
        setEditedMedTech(res.data);
        console.log(res.data);
        onClose(); // Close the modal after successful update
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(payload);
  };

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
        <form onSubmit={handleSubmit}>
          <div className="bg-[#4867D6] text-white p-4 rounded-t-lg">
            <h2 className="text-2xl font-semibold">Edit MedTech Profile</h2>
          </div>
          <div className="p-4 grid g">
            <p className="mb-2">
              <span className="font-semibold">First Name:</span>{" "}
              <input
                type="text"
                name="firstName"
                value={editedMedTech.firstName}
                onChange={handleInputChange}
              />
            </p>
            <p className="mb-2">
              <span className="font-semibold">Last Name:</span>{" "}
              <input
                type="text"
                name="lastName"
                value={editedMedTech.lastName}
                onChange={handleInputChange}
              />
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span>
              <input
                type="text"
                name="email"
                value={editedMedTech.email}
                onChange={handleInputChange}
              />
            </p>
            <p className="mb-2">
              <span className="font-semibold">License Number:</span>{" "}
              <input
                type="text"
                name="licenseNumber"
                value={editedMedTech.licenseNumber}
                onChange={handleInputChange}
              />
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-b-lg flex justify-center">
            <button
              type="submit"
              className="bg-[#4867D6] p-2 text-white rounded-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMedTechModal;

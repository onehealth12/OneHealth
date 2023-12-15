import React, { useState } from "react";
import { useStore } from "../../store";
import axios from "axios";
import { toast } from "react-toastify";

const UploadFile = ({ visible, onClose, id }) => {
  const [labFiles, setLabFiles] = useState([]);
  const { createLabResult } = useStore();

  // handle and convert files to base64
  const handleLabFiles = (e) => {
    const files = e.target.files;
    const filesArray = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      // Check if the file type is either an image or PDF
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setFileToBase(file);
        filesArray.push(file);
      } else {
        // Display a message or handle the invalid file type as needed
        console.log(`Invalid file type: ${file.type}`);
      }
    }
  
    console.log("handleLabFiles: ", filesArray, id);
  };
  

  // set files to base64
  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setLabFiles((prevFiles) => [...prevFiles, reader.result]);
      console.log("setFileToBase: ", reader.result);
    };
  };

  // submit the form
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      // Use axios to send an array of files
      const { data } = await axios.post(
        "http://localhost:5000/api/medTech/appointment/labresult/create/",
        { appointmentId: id, labFiles }
      );

      if (data.success === true) {
        setLabFiles([]);
        toast.success("Uploaded successfully");
      }
      console.log("Uploaded successfully");
      onClose();
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  };

  if (!visible) return null;
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
        <form action="" encType="multipart/form-data" onSubmit={submitForm}>
          <div className="modal-header bg-[#4867D6] text-white p-4 rounded-t-lg">
            <h2 className="text-2xl font-semibold">Upload Lab Result</h2>
          </div>

          <div className="modal-content p-4">
          <input onChange={handleLabFiles} type="file" name="labFiles" multiple />
          </div>

          <div className="modal-footer bg-gray-100 p-4 rounded-b-lg flex justify-end">
            <button
              type="submit"
              className="bg-[#4867D6] hover:bg-[#32499b] text-white px-4 py-2 rounded-lg focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;

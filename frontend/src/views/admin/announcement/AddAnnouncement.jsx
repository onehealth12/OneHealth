import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";

const AddAnnouncement = () => {
  const [userRole, setUserRole] = useState("admin");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [announcementImages, setAnnouncementImages] = useState([]);

  const handleImages = (e) => {
    const files = e.target.files;
    const filesArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if the file type is either an image or PDF
      if (file.type.startsWith("image/")) {
        setFileToBase(file);
        filesArray.push(file);
      } else {
        // Display a message or handle the invalid file type as needed
        console.log(`Invalid file type: ${file.type}`);
      }
    }
  };

  // set files to base64
  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAnnouncementImages((prevFiles) => [...prevFiles, reader.result]);
      console.log("setFileToBase: ", reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: title,
      startDate: startDate,
      endDate: endDate,
      announcementImages: announcementImages,
    };

    try {
      const { data } = await axios.post(
        "https://onehealth-backend.onrender.com/api/admin/announcement/create",
        payload
      );

      if (data.success === true) {
        setAnnouncementImages([]);
        toast.success("Uploaded successfully");
      }
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }

    console.log(payload);

    // Handle form submission here, e.g., send data to a server
  };

  return (
    <>
      <div className="flex">
        <Sidebar userRole={userRole} />
        <div className="flex-1">
          <h1 className="text-center text-2xl font-bold">
            Add new announcement
          </h1>
          <div className="max-w-md mx-auto">
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="file"
                  name="image"
                  onChange={handleImages}
                  multiple
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              {/* End Date */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="text-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAnnouncement;

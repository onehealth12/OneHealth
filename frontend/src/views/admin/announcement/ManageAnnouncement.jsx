import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { useEffect } from "react";
import axios from "axios";
const ManageAnnouncement = () => {
  const [userRole, setUserRole] = useState("admin");
  const [announcements, setAnnouncements] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  const token = tokenObject.token;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const openImageUrlInNewTab = (url) => {
    window.open(url, "_blank");
  };

  useEffect(() => {
    axios
      .get("https://onehealth-backend.onrender.com/api/admin/announcement/get")
      .then((res) => {
        console.log(res.data);
        setAnnouncements(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = (id) => {
    axios
      .delete(
        `https://onehealth-backend.onrender.com/api/admin/announcement/delete/${id}`,
        headerToken
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="flex">
        <Sidebar userRole={userRole} />
        <div className="w-full">
          <h1 className="text-center text-2xl font-bold">
            Manage Announcements
          </h1>
          <div className="mt-24">
            <h2 className="ml-4">List of Announcements</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Publish Date</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {announcements.length === 0 ? (
                  <tr>
                    <td>No announcements</td>
                  </tr>
                ) : (
                  announcements.map((announcement) => (
                    <tr key={announcement._id}>
                      <td className="border text-center p-2">
                        {announcement.title}
                      </td>
                      <td className="border text-center p-2">
                        {announcement.announcementImage.length > 0 ? (
                          <img
                            src={announcement.announcementImage[0].url}
                            alt={announcement.title}
                            className="w-16 h-16 object-cover cursor-pointer"
                            onClick={() =>
                              openImageUrlInNewTab(
                                announcement.announcementImage[0].url
                              )
                            }
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="border text-center p-2">
                        {formatDate(announcement.startDate)} -{" "}
                        {formatDate(announcement.endDate)}
                      </td>
                      <td className="border text-center p-2">
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded"
                          onClick={() => handleDelete(announcement._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAnnouncement;

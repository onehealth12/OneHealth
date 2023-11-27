import React, { useState, useEffect } from "react";
import Axios from "axios";
import Sidebar from "../../../components/Sidebar";

const FindPatient = () => {
  const [userRole, setUserRole] = useState("receptionist");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await Axios.get(
        `http://localhost:5000/api/receptionist/patient/search?q=${searchTerm}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // You can perform an initial search when the component loads here, if needed.
  }, []);

  return (
    <div className="flex w-screen">
      <Sidebar userRole={userRole} />
      <div className="w-full ml-8">
        <div className="flex flex-col items-center">
          <h1 className="text-center text-3xl font-bold mb-4">Patient Search</h1>
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="block w-72 px-4 py-2 text-gray-700 bg-white border rounded-full focus:ring-2 focus:ring-sky-600 focus:outline-none"
              placeholder="Search by Firstname or Lastname"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="ml-4 px-4 py-2 text-white bg-sky-600 rounded-full"
              onClick={handleSearch}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-t-2 border-r-2 border-b-2 border-sky-200 rounded-full animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
        {searchResults.length > 0 ? (
          <div className="mt-8">
            <div className="p-4 bg-white shadow rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-sky-600 text-white">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((patient) => (
                    <tr key={patient._id}>
                      <td className="p-3">{patient._id}</td>
                      <td className="p-3">
                        {patient.firstName} {patient.lastName}
                      </td>
                      <td className="p-3">{patient.email}</td>
                      <td className="p-3">{patient.mobileNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <p>No results found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPatient;

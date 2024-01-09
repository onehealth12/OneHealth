import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";

const DiagnosisList = () => {
  const [userRole, setUserRole] = useState("admin");
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  //Get token string only
  const token = tokenObject.token;
  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get(
        "https://onehealth-backend.onrender.com/api/admin/department/get",
        headerToken
      )
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCreateDiagnosis = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your backend API to create a diagnosis
      const response = await axios.post(
        "https://onehealth-backend.onrender.com/api/admin/diagnosis/create",
        {
          diagnosis: {
            name,
            department: selectedDepartment,
          },
        }
      );

      // Handle success, for example, show a success message
      console.log("Diagnosis created successfully:", response.data);

      // You can also reset the form fields if needed
      setName("");
      setSelectedDepartment("");
    } catch (error) {
      // Handle errors, for example, show an error message
      console.error("Error creating diagnosis:", error.message);
    }
  };

  useEffect(() => {
    axios
      .get(
        "https://onehealth-backend.onrender.com/api/admin/diagnosis/get",
        headerToken
      )
      .then((res) => {
        setDiagnoses(res.data);
        setFilteredDiagnoses(res.data); // Initially set filteredDiagnoses to all diagnoses
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDepartmentFilter = (selectedDepartmentId) => {
    if (selectedDepartmentId) {
      const filtered = diagnoses.filter(
        (diagnosis) => diagnosis.department?._id === selectedDepartmentId
      );
      setFilteredDiagnoses(filtered);
    } else {
      setFilteredDiagnoses(diagnoses); // If no department is selected, show all diagnoses
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(
        `https://onehealth-backend.onrender.com/api/admin/diagnosis/${id}`,
        headerToken
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="flex w-screen">
        <Sidebar userRole={userRole} />
        <div className="w-full overflow-auto">
          <div className="h-screen flex flex-col items-center">
            <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
              <h1 className="text-center text-2xl font-semibold mb-4">
                Diagnosis List
              </h1>
              <form onSubmit={handleCreateDiagnosis}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name:
                    <input
                      className="mt-1 p-2 w-full border rounded-md"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Department:
                    <select
                      className="mt-1 p-2 w-full border rounded-md"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option key={department._id} value={department._id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                  type="submit"
                >
                  Create Diagnosis
                </button>
              </form>
            </div>

            <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Filter by Department:
                <select
                  className="mt-1 p-2 w-full border rounded-md"
                  value={filterDepartment}
                  onChange={(e) => {
                    setFilterDepartment(e.target.value);
                    handleDepartmentFilter(e.target.value);
                  }}
                >
                  <option value="">All Departments</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md mt-4">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Department</th>
                    <th className="py-2 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDiagnoses.map((diagnosis) => (
                    <tr key={diagnosis._id}>
                      <td className="py-2 px-4 border-b">{diagnosis.name}</td>
                      <td className="py-2 px-4 border-b">
                        {diagnosis.department?.name}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                          onClick={() => handleDelete(diagnosis._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiagnosisList;

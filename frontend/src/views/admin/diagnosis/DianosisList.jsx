import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";

const DiagnosisList = () => {
  const [userRole, setUserRole] = useState("admin");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [departments, setDepartments] = useState([]);
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
      .get("http://localhost:5000/api/admin/department/get", headerToken)
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
        "http://localhost:5000/api/admin/diagnosis/create",
        {
          diagnosis: {
            name,
            category,
            department: selectedDepartment,
          },
        }
      );

      // Handle success, for example, show a success message
      console.log("Diagnosis created successfully:", response.data);

      // You can also reset the form fields if needed
      setName("");
      setCategory("");
      setSelectedDepartment("");
    } catch (error) {
      // Handle errors, for example, show an error message
      console.error("Error creating diagnosis:", error.message);
    }
  };

  return (
    <>
      <div className="flex w-screen">
        <Sidebar userRole={userRole} />
        <div className="w-full ml-8">
          <div className="h-screen flex items-center justify-center">
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
                    Category:
                    <input
                      className="mt-1 p-2 w-full border rounded-md"
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DiagnosisList;

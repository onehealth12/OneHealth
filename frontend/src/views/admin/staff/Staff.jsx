import React, {useState, useEffect} from 'react'
import Sidebar from "../../../components/Sidebar";
import axios from 'axios';
const Staff = () => {
  const [userRole, setUserRole] = useState('admin');
  const [receptionists, setReceptionists] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  //Get token object
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  //Get token string only

  const token = tokenObject.token;
  const username = tokenObject.name;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/receptionist/get", headerToken)
      .then((res) => {
        setReceptionists(res.data);
      })
      .catch((err) => console.log(err));
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      firstName,
      lastName,
      email,
      password
    }
    axios.post('http://localhost:5000/api/admin/receptionist/create', payload, headerToken)
          .then((res) => {
            setFirstName('')
            setLastName('')
            setEmail('')
            setPassword('')
            window.location.reload()
          })
          .catch((err) => console.log('Error: ') + err)

  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/admin/receptionist/${id}`, headerToken)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
    <div className='flex'>
    <Sidebar userRole={userRole}/>
        <div className="w-full">
          <h1 className="mt-8 font-bold text-center">Add New Staff</h1>
          <div className="max-w-md mx-auto">
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    
                  >
                    Last Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    
                  >
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                   
                  >
                    Retype Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    
                  />
                </div>
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
          <div className='mt-16'>
            <h2 className='ml-4'>List of Staff</h2>
          <table className="w-full border">
                <thead>
                  <tr className="bg-[#4867D6] text-white">
                    <th className="border p-2">Staff ID</th>
                    <th className="border p-2">Staff Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {receptionists.length === 0 ? (
                    <tr>
                      <td>No data available</td>
                    </tr>
                  ):(receptionists.map((receptionist) => (
                    <tr key={receptionist._id}>
                    <td className="border  text-center p-2">{receptionist._id}</td>
                    <td className="border  text-center p-2">{receptionist.firstName} {receptionist.lastName}</td>
                    <td className="border  text-center p-2">{receptionist.email}</td>
                    <td className="border  text-center p-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                        Edit
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleDelete(receptionist._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                  )))}
                </tbody>
              </table>
          </div>
        </div>
    </div>
    </>
  )
}

export default Staff
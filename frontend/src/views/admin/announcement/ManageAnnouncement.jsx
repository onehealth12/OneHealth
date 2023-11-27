import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
const ManageAnnouncement = () => {
  const [userRole, setUserRole] = useState('admin');
  return (
    <>
    <div className='flex'>
    <Sidebar userRole={userRole}/>
        <div className='w-full'>
          <h1 className='text-center text-2xl font-bold'>Manage Announcements</h1>
          <div className='mt-24'>
            <h2 className='ml-4'>List of Announcements</h2>
          <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Publish Date</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border  text-center p-2">Title 1</td>
                    <td className="border  text-center p-2">09-25-23</td>
                    <td className="border  text-center p-2">Published</td>
                    <td className="border  text-center p-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                        Edit
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="border  text-center p-2">Title 2</td>
                    <td className="border  text-center p-2">09-30-23</td>
                    <td className="border  text-center p-2">Scheduled</td>
                    <td className="border  text-center p-2">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                        Edit
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>
    </div>
    </>
  )
}

export default ManageAnnouncement
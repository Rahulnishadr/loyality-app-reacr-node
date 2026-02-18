import React, { useEffect, useContext, useState } from 'react';
import { apiCall } from '../api/Api';
import { NavLink } from 'react-router-dom';
import Toast from '../reusable/Toast';
import { showToast } from "../reusable/Toast";
import axios from 'axios';
import { HeaderContext } from "../reusable/HeaderContext"
import LoaderSpiner from '../reusable/LoaderSpiner';

const StaffList = () => {
  const apiURL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("token")
  const [staffData, setStaffData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const { selectedValue } = useContext(HeaderContext);
  const getAllStaff = async () => {
    setShowLoader(true)
    try {
      const response = await apiCall(`/staff/list?store=${selectedValue}`, "GET");
      if (response.status === 200) {
        setStaffData(response?.data);
        setShowLoader(false)
      }
    } catch (error) {
      console.error(
        "Error fetching staff data:",
        error?.response?.data?.message?.errors || error.message
      );
      setShowLoader(false)
    }
    finally{
      setShowLoader(false)
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios({
        method: 'delete',
        url: `${apiURL}/staff/delete`,
        params: { id },
        headers: { 
         'access-token': `${token}`
      },
      });

      if (response.status === 200) {
        showToast('Staff deleted successfully!', 'warning');
        getAllStaff(); // Refresh the staff list
      }
    } catch (error) {
      showToast(error?.response?.data?.message?.errors || error.message, 'error');
      console.error('Error deleting staff:', error?.response?.data?.message?.errors || error.message);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, [selectedValue]);

  return (
    <div className="max-w-6xl mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <h2 className="text-2xl font-semibold mb-4">Staff List</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border border-gray-300">S.No.</th>
            <th className="p-2 border border-gray-300">Name</th>
            <th className="p-2 border border-gray-300">Role Name</th>
            {/* <th className="p-2 border border-gray-300">Updated By</th> */}
            <th className="p-2 border border-gray-300">Status</th>
            <th className="p-2 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {staffData?.map((staff, index) => (
            <tr key={staff.id} className="hover:bg-gray-100">
              <td className="p-2 border border-gray-300">{index + 1}</td>
              <td className="p-2 border border-gray-300">{staff?.name}</td>
              <td className="p-2 border border-gray-300">{staff?.roleType}</td>
              {/* <td className="p-2 border border-gray-300">{staff?.assignedBy}</td> */}
              <td className="p-2 border border-gray-300">
                <span className="px-3 py-1">
                  {staff?.status}
                </span>
              </td>
              <td className="p-2 border border-gray-300">
                <button className="mr-4 text-[#178eba]">
                  <NavLink to={`/add-staff/${staff?.id}`} className='flex'>
                    <i className="fas fa-pen"></i>
                  </NavLink>

                </button>
                <button className="text-red-500" onClick={() => handleDelete(staff.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2">Previous</button>
        <span className="py-2">1 / 1</span>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2">Next</button>
      </div>
      <Toast />
    </div>
  );
};

export default StaffList;

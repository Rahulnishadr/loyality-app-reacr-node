import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'jspdf-autotable';
import { apiCall } from '../api/Api';
import LoaderSpiner from '../reusable/LoaderSpiner';
import ExportDropdown from '../reusable/Export_to_excel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { showPopup } from '../reusable/Toast';
import Toast from '../reusable/Toast';
import { HeaderContext } from "../reusable/HeaderContext"
// import Filter from '../reusable/Filter';
import { IoIosArrowBack } from "react-icons/io";


const UsedCouponList = () => {
  // const { selectedValue } = useContext(HeaderContext);
  const { selectedValue = "rajnigandha" } = useContext(HeaderContext);
  // const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  // const [showFilterPopup, setShowFilterPopup] = useState(false);
  // const [expiredCoupons, setExpiredCoupons] = useState([]);
  // const [isInitialRender, setIsInitialRender] = useState(true);


  const location = useLocation();
  const { couponBatchId } = location.state || {}; // Safely access state

  


  const navigate = useNavigate();
  const handleBackButtonClick = () => navigate('/coupons-list');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentList = tableData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

 
  const fetchData = async () => {
    setShowLoader(true);
    try {
      const url = `/coupon/getBetchID?couponBatchId=${couponBatchId}`;
      const response = await apiCall(url, "GET");

      if (response.status === 200) {
        setShowLoader(false);
        const data = response.data;
        

        const formattedData = data.map((item) => ({
          id: item.id ,
          product: item.product ,
          productSKU: item.productSKU ,
          sno: item.sno ,
          code: item.code ,
          startTime: item.startTime
          ? new Date(item.startTime).toISOString().split("T")[1].split(".")[0]
          : "",
        endTime: item.endTime
          ? new Date(item.endTime).toISOString().split("T")[1].split(".")[0]
          : "",
          createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            : '',
          stdate: item.stdate ,
          enddate: item.enddate ,
          points: item.points ,
          createdBy: item.createdBy ,
          expiryStatus: item.expiryStatus ,
        }));

        setTableData(formattedData);
      } else {
        setShowLoader(false);
        console.error("Unexpected response format:", response.data);
        setTableData([]);
      }
    } catch (error) {
      setShowLoader(false);
      console.error("Error fetching coupon list:", error);
      // Optionally, you can add a popup or toast notification here:
      // showPopup("error", "Failed to fetch data.");
    }
  };


  useEffect(() => {
    fetchData();
  }, [selectedValue]);

 

  const columns = [
    // "srno",
    "product",
    "productSKU",
    "sno",
    "code",
    "points",
    "stdate",
    "enddate",
    "startTime",
    "endTime",
    "expiryStatus",
    "createdAt",
    "createdBy",
  ];
  const headers = {
    // srno: "Sr. No",
    product: "Product Name",
    productSKU: "Product Sku",
    sno: "Serial No",
    code: "Code",
    points: "Reward Point",
    stdate: "Start Date",
    enddate: "End Date",
    startTime: "Start Time",
    endTime: "End Time",
    expiryStatus: "Status",
    createdAt: "Created At",
    createdBy: "Update By Staff",

  };

  

  const handleCheckboxChange = async (item) => {
     const newStatus = item.expiryStatus === "Active" ? "Inactive" : "Active";

     const updatedTableData = tableData.map((coupon) =>
      coupon.code === item.code
        ? { ...coupon, expiryStatus: newStatus }
        : coupon
    );
    setTableData(updatedTableData); // Update the state immediately

    try {
      // Call the API to update the status
      const response = await apiCall(
        `/coupon/update?id=${item.id}`,
        "PUT",
        { status: newStatus }
      );

      if (response.status === 200) {
        await fetchData();
        
      } else {
        console.error("Error updating status:", response.data);
        // Revert the status if the API call fails
        const revertedTableData = tableData.map((coupon) =>
          coupon.code === item.code
            ? { ...coupon, expiryStatus: item.expiryStatus }
            : coupon
        );
        setTableData(revertedTableData);
      }
    } catch (error) {
      console.error("Error while making the API call:", error);
      // Revert the status if there is an error in the API call
      const revertedTableData = tableData.map((coupon) =>
        coupon.code === item.code
          ? { ...coupon, expiryStatus: item.expiryStatus }
          : coupon
      );
      setTableData(revertedTableData);
    }
  };
  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <ToastContainer />
      <div className='flex gap-4 mb-4'>
        <button
          className='px-2 py-1 rounded-md text-xl'
          onClick={handleBackButtonClick}
        >
          <span className='flex items-center justify-center'><IoIosArrowBack /> Back</span>
        </button>
       </div>
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-2xl font-medium">Coupon Batch</h1>
        <div className="flex space-x-2">

          <ExportDropdown
            data={currentList.map((item, index) => ({
              ...item,
              srno: index + 1,
            }))}
            filename="Coupon_Batch_List"
            columns={columns}
            headers={headers}
          />
        </div>
      </div>



      <div className="overflow-x-auto overflow-y-auto w-full">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b h-12">
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Sr. No</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Product Name</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Product Sku</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Serial No</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Code</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Reward Point</th>
              {/* <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Pin</th> */}
              {/* <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">QR Code</th> */}
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Start Date</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">End Date</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Status</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Created At</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Update By Staff</th>
              </tr>
          </thead>
          <tbody>
            {currentList.length > 0 ? (
              currentList.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 h-12">
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {indexOfFirst + index + 1}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.product}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.productSKU}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.sno}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.code}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.points}
                  </td>
                 

                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.stdate}
                  </td>

                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.enddate}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.expiryStatus === "Active"}
                        onChange={() => handleCheckboxChange(item)}
                        className="form-checkbox text-blue-500"
                      />
                      <span className='mb-1'>
                        {item.expiryStatus === "Active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.createdAt || ""}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.createdBy}
                  </td>


                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="p-2 text-center text-red-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
      <div className="mt-4 flex justify-end items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed me-2' : 'bg-blue-600 text-white me-2'}`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed ms-2' : 'bg-blue-600 text-white ms-2'}`}
        >
          Next
        </button>
      </div>
      <Toast />
    </div>
  );
};

export default UsedCouponList;

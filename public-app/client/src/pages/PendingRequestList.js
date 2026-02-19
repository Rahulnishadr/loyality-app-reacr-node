import React, { useEffect, useContext, useState } from 'react';
import { apiCall } from '../api/Api';
import LoaderSpiner from '../reusable/LoaderSpiner';
import ExportDropdown from '../reusable/Export_to_excel';
import { HeaderContext } from "../reusable/HeaderContext"
import Filter from '../reusable/Filter';
import { showPopup } from '../reusable/Toast';
import msg from "../reusable/msg.json"
import { API_URLS, HTTP_METHODS, HTTP_RESPONSE } from '../reusable/constants';


const PendingRequestList = () => {
  const tokenData = {};

  const { selectedValue } = useContext(HeaderContext);
  const [transactions, setTransactions] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [flag, setFlag] = useState(true);

  const [formState, setFormState] = useState({
      startDate: "",
      endDate: "",
      status: "",
      brandName: "",
    });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const getPendingRequsestList = async () => {
    setShowLoader(true);
    try {
      const response = await apiCall(API_URLS.PENDING_REQUEST_LIST.getPendingVouchersList, HTTP_METHODS.GET, {});

      if (response.status === HTTP_RESPONSE.SUCCESS) {
        setShowLoader(false);

        const transformedData = response.data.map((item) => ({
          id: item?.id,
          brandImage: item?.brandImageUrl || "",
          brandName: item?.BrandName || "",
          accountId: item?.accountNumber || "",
          customerName: item?.customerName || "",
          email: item?.email || "",
          createAt: item?.createdIstAt,
          contactNo: item?.phone_number || "",
          redeemPoints: item?.redeemPoints || "",
          denomination: item?.Denomination || "",
          externalOrderId: item?.ExternalOrderId || "",
          quantity: item?.Quantity || "",
          status: item?.status || "",
          action: "",
        }));

        setTransactions(transformedData);
      }
    } catch (error) {
      setShowLoader(false);
      if (error?.message == msg.requestNotFound) {
        setTransactions([])
      }
      showPopup('error', error.message)
    }finally{
      setShowLoader(false);
    }
  };

  useEffect(() => {
    getPendingRequsestList();
  }, [selectedValue])

  const handleSearch = async () => {
    try {
      const response = await apiCall(API_URLS.PENDING_REQUEST_LIST.pendingVouchersSearch + searchTerm, HTTP_METHODS.GET, {});
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        const transformedData = response.data.map((item) => ({
          id: item?.id,
          brandImage: item?.brandImageUrl || "",
          brandName: item?.BrandName || "",
          accountId: item?.accountNumber || "",
          customerName: item?.customerName || "",
          email: item?.email || "",
          createAt: item?.createdIstAt,
          contactNo: item?.phone_number || "",
          redeemPoints: item?.redeemPoints || "",
          denomination: item?.Denomination || "",
          externalOrderId: item?.ExternalOrderId || "",
          quantity: item?.Quantity || "",
          status: item?.status || "",
          action: "",
        }));
        setTransactions(transformedData);
        setCurrentPage(1);
      }
    }
    catch (error) {
      showPopup("error", error.message);
    }
  }

  useEffect(() => {
    if (flag) {
      setFlag(false);
      return;
    }

    const debounce = setTimeout(() => {
      if (!searchTerm.trim()) {
        getPendingRequsestList();
      } else {
        handleSearch();
      }
    }, 1500);

    return () => clearTimeout(debounce);
  }, [searchTerm])

  // filter
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 15;

  // Calculate the indices of the first and last tags to display for the current page
  const indexOfLast = currentPage * tagsPerPage;
  const indexOfFirst = indexOfLast - tagsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(transactions.length / tagsPerPage);

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [textarea, setTextArea] = useState('');

  const handleApproveClick = (id) => {
    setShowApprovePopup(id);
    setShowRejectPopup(null);
  };

  const handleRejectClick = (id) => {
    setShowRejectPopup(id);
    setShowApprovePopup(null);
  };

  const closePopups = () => {
    setShowApprovePopup(null);
    setShowRejectPopup(null);
  };

  const handleApproveReject = async (status) => {
    try {
      if (status === 'Completed') {
        const data = {
          requestId: showApprovePopup,
          store: selectedValue
        }
        const response = await apiCall(API_URLS.PENDING_REQUEST_LIST.approvePendingVoucher, HTTP_METHODS.PUT, data);

        if (response.status === HTTP_RESPONSE.SUCCESS) {
          getPendingRequsestList();
          setShowApprovePopup(null);
          showPopup('success', msg.voucherApproved);
        }
        else {
          setShowApprovePopup(null);
          showPopup('error', response.message);
        }
      }
      else if (status === 'Rejected') {
        const data = {
          requestId: showRejectPopup,
          message: textarea,
          store: selectedValue
        }
        const response = await apiCall(API_URLS.PENDING_REQUEST_LIST.rejectPendingVoucher, HTTP_METHODS.PUT, data);

        if (response.status === HTTP_RESPONSE.SUCCESS) {
          getPendingRequsestList();
          setShowRejectPopup(null);
        }
        else {
          setShowApprovePopup(null);
          showPopup('error', response.message);
        }
      }
    }
    catch (error) {
      setShowApprovePopup(null);
      showPopup('error', error.message);
    }
  }

  const headers = {
    id: "Id",
    brandName: "Brand Name",
    accountId: "Account Number",
    customerName: "Customer Name",
    contactNo: "Mobile No.",
    email: "Email",
    createAt: "Redeem Date",
    redeemPoints: "Redeem Points",
    quantity: "Quantity",
    denomination: "Denomination",
    externalOrderId: "External Order ID",
    status: "Status"
  }

  const columns = [
    "id",
    "brandName",
    "accountId",
    "customerName",
    "contactNo",
    "email",
    "createAt",
    "redeemPoints",
    "denomination",
    "externalOrderId",
    "quantity",
    "status",
  ];

  const disableUpdate = ()=> {
    showPopup('warning', msg.readOnly);
  }

  const filterApi = async (payload) => {
    const { endDate, startDate } = payload;
    return apiCall(`/voucher/filterPendingRequest?startDate=${startDate}&endDate=${endDate}`, HTTP_METHODS.GET, {});
  };

  const handleFilterApply = (data) => { 
    if (data.length === 0) {
      setTransactions([]);
      return;
    }

    const filteredData = data?.data?.map((item) => ({
      id: item?.id,
      brandImage: item?.brandImageUrl || "",
      brandName: item?.BrandName || "",
      accountId: item?.accountNumber || "",
      customerName: item?.customerName || "",
      email: item?.email || "",
      createAt:
        item?.createdAt
          ? new Date(item?.createdAt)
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")
          : "",
      contactNo: item?.phone_number || "",
      redeemPoints: item?.redeemPoints || "",
      denomination: item?.Denomination || "",
      externalOrderId: item?.ExternalOrderId || "",
      quantity: item?.Quantity || "",
      status: item?.status || "",
      action: "",
    }));



    setTransactions(filteredData);
  };

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h1 className="text-2xl font-medium whitespace-nowrap mb-2">Pending Request List</h1>

        <div className="flex">
          <input
            type="text"
            placeholder="Search By Mobile No, Account No"
            className="border border-gray-300 mr-2 rounded-md px-4 py-2 w-full sm:w-3/4 lg:w-[400px]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Filter
            isVisible={showFilterPopup}
            onClose={() => setShowFilterPopup(false)}
            filterApi={filterApi}
            onFilterApply={handleFilterApply}
            filterConfig={[
              { field: "startDate", label: "Start Date", type: "date" },
              { field: "endDate", label: "End Date", type: "date" },
            ]}
            // clear={getPendingRequsestList}
            formState={formState}
            setFormState={setFormState}
          />

          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setShowFilterPopup(true)}
          >
            Filter
          </button>

          <ExportDropdown
            data={transactions.map((item, index) => ({
              ...item,
              srno: index + 1,
            }))}
            filename="Pending_Request_List"
            columns={columns}
            headers={headers} />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b text-left h-12">
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Sr. No</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Id</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Brand Name</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Account Number</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Customer Name</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Mobile No.</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Email</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Redeem Date</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Redeem Points</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Quantity</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Denomination</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">External OrderId</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Status</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Action</th>

            </tr>
          </thead>
          <tbody>
            {
              currentTransactions.length > 0 ? (
                currentTransactions.map((transaction, index) => (
                  <tr key={transaction?.id} className="border-b font-medium text-sm text-left hover:bg-gray-50">
                    <td className="px-2 border-r whitespace-nowrap">{indexOfFirst + index + 1}</td>
                    <td className="px-2 py-1 border border-gray-300">
                      {transaction.id}
                    </td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.brandName}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.accountId}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.customerName}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.contactNo}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.email}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.createAt}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.redeemPoints}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.quantity}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.denomination}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.externalOrderId}</td>
                    <td className="px-2 border-r whitespace-nowrap">{transaction?.status}</td>
                    <td className="px-2 border-r">

                      <div className='flex flex-col p-1'>
                        <>
                          <button className='bg-blue-500 text-white px-2 py-1 rounded mb-1 w-18' onClick={() => handleApproveClick(transaction?.id)}>Approve</button>
                          <button className='bg-red-500 text-white px-2 py-1 rounded w-18' onClick={() => handleRejectClick(transaction?.id)}>Reject</button>
                        </>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="p-4 text-center text-red-500">
                    No data found
                  </td>
                </tr>
              )
            }

          </tbody>
        </table>
      </div>

      {/* Approve Popup */}
      {showApprovePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-3xl font-medium mb-4">Confirm</h2>
            <p className='text-md'>Are you sure you want to accept the request?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closePopups}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleApproveReject('Completed')}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Popup */}
      {showRejectPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-3xl font-medium mb-4">Confirm</h2>
            <textarea
              placeholder="Reason of Reject"
              className="border border-gray-300 rounded p-2 w-full mb-4"
              value={textarea}
              onChange={(e) => setTextArea(e.target.value)}
            ></textarea>
            <p className='text-md'>Are you sure you want to reject the request?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closePopups}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleApproveReject('Rejected')}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
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

    </div>
  );

};

export default PendingRequestList;

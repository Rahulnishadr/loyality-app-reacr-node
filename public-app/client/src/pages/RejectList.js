import React, { useState, useContext, useEffect } from 'react';
import { apiCall } from '../api/Api';
import 'jspdf-autotable';
import LoaderSpiner from '../reusable/LoaderSpiner';
import ExportDropdown from '../reusable/Export_to_excel';
import Filter from '../reusable/Filter';
import { HeaderContext } from "../reusable/HeaderContext"
import { showPopup } from '../reusable/Toast';
import { API_URLS, HTTP_METHODS, HTTP_RESPONSE } from '../reusable/constants';
import msg from "../reusable/msg.json"

const RejectList = () => {

  const [transactions, setTransactions] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const { selectedValue } = useContext(HeaderContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [flag, setFlag] = useState(true);

  const [formState, setFormState] = useState({
    startDate: "",
    endDate: "",
    status: "",
    brandName: "",
  });
  const getRejectRequsestList = async () => {
    setShowLoader(true);

    try {
      const response = await apiCall(API_URLS.REJECT_REQUEST_LIST.getRejectedVouchersList, HTTP_METHODS.GET, {});
 
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        setShowLoader(false);

        const transformedData = response.data.map((item) => ({
          id: item?.id || "",
          brandImage: item?.brandImageUrl || "",
          brandName: item?.BrandName || "",
          accountId: item?.accountNumber || "",
          customerName: item?.customerName || "",
          email: item?.email || "",
          createAt: item?.createdIstAt,
          rejectDate: item?.updatedIstAt,
          contactNo: item?.phone_number || "",
          redeemPoints: item?.redeemPoints || "",
          denomination: item?.Denomination || "",
          externalOrderId: item?.ExternalOrderId || "",
          quantity: item?.Quantity || "",
          status: item?.status || "",
          rejectionMessage: item?.ErrorMessage || "",
          updatedByStaff: item?.updateByStaff || "",
          action: "", // Placeholder for potential future functionality
        }));

        setTransactions(transformedData);
      }
    } catch (error) {
      setShowLoader(false);
      if (error?.message == msg.requestNotFound) {
        setTransactions([])
      }
      showPopup("error", error.message);
    }finally{
      setShowLoader(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearch = async () => {
    try {
      const response = await apiCall(API_URLS.REJECT_REQUEST_LIST.rejectedVouchersSearch + searchTerm, HTTP_METHODS.GET, {});
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        const transformedData = response.data.map((item) => ({
          id: item?.id || "",
          brandImage: item?.brandImageUrl || "",
          brandName: item?.BrandName || "",
          accountId: item?.accountNumber || "",
          customerName: item?.customerName || "",
          email: item?.email || "",
          createAt: item?.createdIstAt,
          rejectDate: item?.updatedIstAt,
          contactNo: item?.phone_number || "",
          redeemPoints: item?.redeemPoints || "",
          denomination: item?.Denomination || "",
          externalOrderId: item?.ExternalOrderId || "",
          quantity: item?.Quantity || "",
          status: item?.status || "",
          rejectionMessage: item?.ErrorMessage || "",
          updatedByStaff: item?.updateByStaff || "",
          action: "", // Placeholder for potential future functionality
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
        getRejectRequsestList();
      } else {
        handleSearch();
      }
    }, 1500);

    return () => clearTimeout(debounce);
  }, [searchTerm])

  useEffect(() => {
    getRejectRequsestList();
  }, [selectedValue])

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

  const headers = {
    id: "ID",
    brandName: "Brand Name",
    accountId: "Account Number",
    customerName: "Customer Name",
    contactNo: "Mobile No.",
    email: "Email",
    createAt: "Redeem Date",
    rejectDate: "Rejection Date",
    redeemPoints: "Redeem Points",
    quantity: "Quantity",
    denomination: "Denomination",
    externalOrderId: "External Order ID",
    status: "Status",
    rejectionMessage: "Rejection Message",
    updatedByStaff: "Updated By Staff"
  }

  const columns = [
    "id",
    "brandName",
    "accountId",
    "customerName",
    "contactNo",
    "email",
    "createAt",
    "rejectDate",
    "redeemPoints",
    "quantity",
    "denomination",
    "externalOrderId",
    "status",
    "rejectionMessage",
    "updatedByStaff",
  ];

  const filterApi = async (payload) => {
    const { endDate, startDate } = payload;
    return apiCall(`/voucher/filterRejectRequest?startDate=${startDate}&endDate=${endDate}`, HTTP_METHODS.GET, {});
  };

  const handleFilterApply = (data) => {

    if (data.length === 0) {
      setTransactions([]);
      return;
    }

    const transformedData = data?.data?.map((item) => ({
      id: item?.id || "",
      brandImage: item?.brandImageUrl || "",
      brandName: item?.BrandName || "",
      accountId: item?.accountNumber || "",
      customerName: item?.customerName || "",
      email: item?.email || "",
      createAt: item?.createdIstAt,
      rejectDate: item?.updatedIstAt,
      contactNo: item?.phone_number || "",
      redeemPoints: item?.redeemPoints || "",
      denomination: item?.Denomination || "",
      externalOrderId: item?.ExternalOrderId || "",
      quantity: item?.Quantity || "",
      status: item?.status || "",
      rejectionMessage: item?.ErrorMessage || "",
      updatedByStaff: item?.updateByStaff || "",
      action: "", // Placeholder for potential future functionality
    }));

    setTransactions(transformedData);
  };


  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h1 className="text-2xl font-medium whitespace-nowrap mb-2">Reject Voucher List</h1>

        <div className="flex content-between">
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
            filterFields={{ page: 1, limit: 15 }}
            filterConfig={[
              { field: "startDate", label: "Start Date", type: "date" },
              { field: "endDate", label: "End Date", type: "date" },
            ]}
            // clear={getRejectRequsestList}
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
            filename="Reject_List"
            columns={columns}
            headers={headers}
          />
        </div>
      </div>


      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b h-12">
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Sr. No</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Id</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Brand Name</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Account Number</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Customer Name</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Mobile No.</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Email</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Redeem Date</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Rejection Date</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Redeem Points</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Quantity</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Denomination</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">External OrderId</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Status</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Rejection Message</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Updated By Staff</th>
            </tr>
          </thead>
          <tbody>
            {
              currentTransactions.length > 0 ? (currentTransactions.map((transaction, index) => (
                <tr key={transaction.id} className="border-b text-sm text-left font-medium hover:bg-gray-50 h-12">
                  <td className="px-2 border-r whitespace-nowrap">{indexOfFirst + index + 1}</td>
                  <td className="px-2 py-1 border border-gray-300 text-left">
                    {transaction?.id}
                  </td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.brandName}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.accountId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.customerName}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.contactNo}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.email}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.createAt}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.rejectDate}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.redeemPoints}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.quantity}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.denomination}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.externalOrderId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.status}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.rejectionMessage}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.updatedByStaff}</td>

                </tr>
              )))
                : (
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

export default RejectList;

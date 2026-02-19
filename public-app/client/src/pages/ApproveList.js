import React, { useState, useContext, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import 'jspdf-autotable';
import { apiCall } from '../api/Api'
import LoaderSpiner from '../reusable/LoaderSpiner';
import ExportDropdown from '../reusable/Export_to_excel';
import Filter from "../reusable/Filter";
import { HeaderContext } from "../reusable/HeaderContext"
import { showPopup } from '../reusable/Toast';
import msg from "../reusable/msg.json"
import { API_URLS, HTTP_METHODS, HTTP_RESPONSE } from '../reusable/constants';

const ApproveList = () => {
  const data = {};
  const { selectedValue } = useContext(HeaderContext);
  const [showLoader, setShowLoader] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [formState, setFormState] = useState({
    startDate: "",
    endDate: "",
    status: "",
    brandName: "",
  });
  const getApproveRequestList = async () => {
    setShowLoader(true);
    try {
      const response = await apiCall(API_URLS.APPROVED_REQUEST_LIST.getAcceptedVoucher, HTTP_METHODS.GET, {});

      if (response.status === HTTP_RESPONSE.SUCCESS) {
        setShowLoader(false);
        // response?.data[0]?.Vouchers[0]?.EndDate
        const transformedData = response?.data.map((item) => ({
          id: item?.id || "",
          approvedBy: item?.approvedBy,
          approvedDate: item?.updatedIstAt,
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
          rejectionMessage: item?.Message || "",
          updatedByStaff: item?.updatedByStaff || "",
          EndDate: item?.endDateOfApprovedVouchers || "",
          // EndDate: item?.PullVouchers[0]?.Vouchers[0]?.EndDate || "",
          action: "",
          buttonValue: item?.buttonValue
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

  const [popupData, setPopupData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flag, setFlag] = useState(true);


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearch = async () => {
    try {
      const response = await apiCall(API_URLS.APPROVED_REQUEST_LIST.approvedVoucherSearch + searchTerm, HTTP_METHODS.GET, {});
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        const transformedData = response.data.map((item) => ({
          id: item?.id || "",
          approvedBy: item?.approvedBy,
          approvedDate: item?.updatedIstAt,
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
          rejectionMessage: item?.Message || "",
          updatedByStaff: item?.updatedByStaff || "",
          action: "",
          buttonValue: item?.buttonValue
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
        getApproveRequestList();
      } else {
        handleSearch();
      }
    }, 1500);

    return () => clearTimeout(debounce);
  }, [searchTerm])

  useEffect(() => {
    getApproveRequestList();
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

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const fetchViewData = async (id) => {
    try {
      const response = await apiCall(API_URLS.APPROVED_REQUEST_LIST.getRequestById + id, HTTP_METHODS.GET, {});
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        const data = response?.data?.PullVouchers?.Vouchers[0] || response.data?.PullVouchers[0].Vouchers[0];
        const { Value, EndDate, VoucherGCcode, VoucherGuid, VoucherNo, Voucherpin } = data;
        setPopupData({
          Value,
          EndDate,
          VoucherGCcode,
          VoucherGuid,
          VoucherNo,
          Voucherpin
        })
      }
    }
    catch (error) {
      showPopup('error', error.message);
    }
  }

  const togglePopup = (transaction) => {

    fetchViewData(transaction.id);
    setIsPopupVisible(true);
  };

  const headers = {
    id: "ID",
    brandName: "Brand Name",
    accountId: "Account Number",
    customerName: "Customer Name",
    contactNo: "Mobile No.",
    email: "Email",
    createAt: "Redeem Date",
    approvedDate: "Approve Date",
    redeemPoints: "Used Points",
    quantity: "Quantity",
    denomination: "Denomination in Rs.",
    externalOrderId: "External Order ID",
    status: "Status",
    updatedByStaff: "Approved By"
  }

  const columns = [
    "id",
    "brandName",
    "accountId",
    "customerName",
    "contactNo",
    "email",
    "createAt",
    "approvedDate",
    "redeemPoints",
    "quantity",
    "denomination",
    "externalOrderId",
    "status",
    "updatedByStaff",
  ];

  const filterApi = async (payload) => {
    const { endDate, startDate } = payload;
    return apiCall(`/voucher/filterAcceptRequest?startDate=${startDate}&endDate=${endDate}`, "GET", {});
  };

  const handleFilterApply = (data) => {

    if (data.length === 0) {
      setTransactions([]);
      return;
    }

    const transformedData = data?.data?.map((item) => ({
      id: item?.id || "",
      approvedBy: item?.approvedBy,
      approvedDate: item?.updatedIstAt,
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
      rejectionMessage: item?.Message || "",
      updatedByStaff: item?.updatedByStaff || "",
      action: "",
      buttonValue: item?.buttonValue
    }));

    setTransactions(transformedData);
  };

  const handleResend = async (id) => {
    setShowLoader(true);
    try {
      const response = await apiCall(API_URLS.APPROVED_REQUEST_LIST.resendVoucher + id, HTTP_METHODS.GET, {});

      if (response.status === HTTP_RESPONSE.SUCCESS) {
        getApproveRequestList();
        showPopup('success', msg.resendSuccessful);
        setShowLoader(false);
      }
    }
    catch (error) {
      showPopup('error', msg.resendLimit);
      setShowLoader(false);
    }
  }


  const handleResendCheck = async (id) => {
    setShowLoader(true);


    try {
      const response = await apiCall(API_URLS.APPROVED_REQUEST_LIST.resendCheck + id, HTTP_METHODS.GET, {});
      if (response.status === HTTP_RESPONSE.SUCCESS) {

        const resendCount = response.data?.resendNotificationCount

        if (resendCount < 2) {
          await handleResend(id);
        }
        // showPopup('success', 'Resend Successfully');
        setShowLoader(false);
      }
    }
    catch (error) {
      showPopup('error', error.message)
      setShowLoader(false);
    }
  }

  const disableUpdate = ()=> {
    showPopup('warning', msg.readOnly);
  }
 
  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h1 className="text-2xl font-medium whitespace-nowrap mb-2">Approve Request List</h1>

        <div className="flex content-between gap-2">
          <input
            type="text"
            placeholder="Search By Mobile No, Account No"
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-3/4 lg:w-[400px]"
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
            // clear={getApproveRequestList}
            formState={formState}
            setFormState={setFormState}
          />

          <button className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowFilterPopup(true)}
          >
            Filter
          </button>
          <ExportDropdown
            data={transactions.map((item, index) => ({
              ...item,
              srno: index + 1,
            }))}
            filename="Approve_List"
            columns={columns}
            headers={headers}
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left border-b h-12">
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Sr. No</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Id</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Brand Name</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Account Number</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Customer Name</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Mobile No.</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Email</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Redeem Date</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Approve Date</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Used Points</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Quantity</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Denomination in Rs.</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">External Order Id</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Status</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Approve By</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">End Date</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Action</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Resend</th>
            </tr>
          </thead>
          <tbody>
            {
              currentTransactions.length > 0 ? (
                currentTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className="border-b text-sm font-medium hover:bg-gray-50 h-12">
                    <td className="px-2 border-r  whitespace-nowrap">{indexOfFirst + index + 1}</td>
                    <td className="px-2 border-r text-left  whitespace-nowrap">{transaction.id}</td>
                    <td className="px-2 border-r text-left  whitespace-nowrap">{transaction.brandName}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.accountId}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.customerName}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.contactNo}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.email}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.createAt}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.approvedDate}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.redeemPoints}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.quantity}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.denomination}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.externalOrderId}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.status}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction.approvedBy}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">{transaction?.EndDate}</td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">
                      <VisibilityIcon className='text-sky-500 cursor-pointer' onClick={() => togglePopup(transaction)} />
                    </td>
                    <td className="px-2 border-r  text-left whitespace-nowrap">
                      <button className={`${transaction.buttonValue == 0 ? 'bg-blue-800' : 'bg-blue-600'} w-16 text-white px-2 py-2 rounded`}
                            onClick={() => handleResendCheck(transaction.id)}
                            disabled={transaction.buttonValue == 0}
                          >{transaction.buttonValue == 0 ? 'Sent' : 'Resend'}</button>
                    </td>
                  </tr>
                ))
              ) :
                (
                  <tr>
                    <td colSpan="12" className="p-4 text-center text-red-500">
                      No data found
                    </td>
                  </tr>
                )
            }
          </tbody>
        </table>

        {isPopupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white w-3/4 p-8 rounded shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl ">Voucher Details</h2>
                <button onClick={() => setIsPopupVisible(false)} className="text-red-500">Close</button>
              </div>

              {/* Voucher Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-2 border-r text-left whitespace-nowrap">Value</th>
                      <th className="px-2 py-2 border-r text-left whitespace-nowrap">End Date</th>
                      <th className="px-2 py-2 border-r text-left whitespace-nowrap">Voucher No</th>
                      <th className="px-2 py-2 border-r text-left whitespace-nowrap">Voucher Pin</th>
                      <th className="px-2 py-2 border-r text-left whitespace-nowrap">Voucher GUID</th>
                      <th className="px-2 py-2 border-r text-left whitespace-nowrap">Voucher GC Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      <tr className="border-b" >
                        <td className="px-2 py-2 border-r text-sm whitespace-nowrap">{popupData?.Value}</td>
                        <td className="px-2 py-2 border-r text-sm whitespace-nowrap">{popupData?.EndDate}</td>
                        <td className="px-2 py-2 border-r text-sm whitespace-nowrap">{popupData?.VoucherNo}</td>
                        <td className="px-2 py-2 border-r text-sm whitespace-nowrap">{popupData?.Voucherpin || ''}</td>
                        <td className="px-2 py-2 border-r text-sm whitespace-nowrap">{popupData?.VoucherGuid}</td>
                        <td className="px-2 py-2 border-r text-sm whitespace-nowrap">{popupData?.VoucherGCcode}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
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
    </div >
  );

};

export default ApproveList;

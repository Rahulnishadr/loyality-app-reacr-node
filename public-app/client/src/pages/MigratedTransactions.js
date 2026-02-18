
import React, { useState, useEffect, useContext } from "react";
import "jspdf-autotable";
import Filter from "../reusable/Filter";
import ExportDropdown from "../reusable/Export_to_excel";
import { apiCall } from "../api/Api";
import LoaderSpiner from '../reusable/LoaderSpiner';
import { showPopup } from "../reusable/Toast";
import { HeaderContext } from "../reusable/HeaderContext";
import { HTTP_METHODS, HTTP_RESPONSE } from "../reusable/constants";

const MigratedTransaction = () => {
  const { selectedValue } = useContext(HeaderContext);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentList = transactions.length > 0 ? transactions.slice(indexOfFirst, indexOfLast) : [];
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    setSearchTerm(value);
  };

  const handleSearch = async () => {
    try {
      setShowLoader(true);
      setCurrentPage(1);
      const response = await apiCall(
        `/script/searchTransactionData?search=${searchTerm}&store=${selectedValue}`,
        HTTP_METHODS.GET
      );
      const data = response?.data;
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        setShowLoader(false);
        const formattedData = data?.map((transaction) => ({
          id: transaction?.id,
          transactionId: transaction?.transition_id,
          category: transaction?.transition_category,
          accountId: transaction?.account_number,
          customerId: transaction?.customer_Id,
          transaction_Medium: transaction?.medium,
          store: transaction?.store,
          point: transaction?.point,
          status: transaction?.transition_status,
          transactionType: transaction?.transactionType,
          registrationDate: transaction?.createdAt
            ? `${String(new Date(transaction?.createdAt).getDate()).padStart(2, '0')}/${String(new Date(transaction?.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(transaction.createdAt).getFullYear()}`
            : '',
          expiryDate: transaction?.expiry_date
            ? transaction?.expiry_date.split('-').join('/')
            : '',
          transactionTime: transaction?.createdAt
            ? `${String(new Date(transaction?.createdAt).getDate()).padStart(2, '0')}/${String(new Date(transaction?.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(transaction.createdAt).getFullYear()}, ${String(new Date(transaction.createdAt).getHours()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getMinutes()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getSeconds()).padStart(2, '0')}`
            : '',
          orderId: transaction?.order_id,
          productDetails: transaction?.product_detail,
          name: transaction?.name,
          mobile_no: transaction?.mobile_no,
          state: transaction?.state,
          city: transaction?.city,
          couponCode: transaction?.coupon_code,
          scanManual: transaction?.scan_manual,
          serialNo: transaction?.serial_no,
        }));
        setTransactions(formattedData);
      }
    }
    catch (error) {
      showPopup("error", error.message);
      
      setShowLoader(false);
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!searchTerm.trim()) {
        fetchTransactions();
      } else {
        handleSearch();
      }
    }, 500)
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const fetchTransactions = async () => {
    setShowLoader(true)
    try {
      const url = `/script/getMigratedTransactions?store=${selectedValue}`;
      const response = await apiCall(url, HTTP_METHODS.GET);
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        setShowLoader(false)
        const data = response?.data;
        const formattedData = data?.map((transaction) => ({
          id: transaction?.id,
          transactionId: transaction?.transition_id,
          category: transaction?.transition_category,
          accountId: transaction?.account_number,
          customerId: transaction?.customer_Id,
          transaction_Medium: transaction?.medium,
          store: transaction?.store,
          point: transaction?.point,
          status: transaction?.transition_status,
          transactionType: transaction?.transactionType,
          orderId: transaction?.order_id,
          registrationDate: transaction?.createdAt
            ? `${String(new Date(transaction?.createdAt).getDate()).padStart(2, '0')}/${String(new Date(transaction?.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(transaction.createdAt).getFullYear()}`
            : '',
          expiryDate: transaction?.expiry_date
            ? transaction?.expiry_date.split('-').join('/')
            : '',
          transactionTime: transaction?.createdAt
            ? `${String(new Date(transaction?.createdAt).getDate()).padStart(2, '0')}/${String(new Date(transaction.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(transaction.createdAt).getFullYear()}, ${String(new Date(transaction.createdAt).getHours()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getMinutes()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getSeconds()).padStart(2, '0')}`
            : '',
          productDetails: transaction?.product_detail,
          name: transaction?.name,
          mobile_no: transaction?.mobile_no,
          state: transaction?.state,
          city: transaction?.city,
          couponCode: transaction?.coupon_code,
          scanManual: transaction?.scan_manual,
          serialNo: transaction?.serial_no,
        }));
        setTransactions(formattedData);
      }
    } catch (error) {

      if (error?.message === "No transactions found") {
        setShowLoader(false)
        setTransactions([]);
      }
      showPopup("error", error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedValue]);

  const columns = [
    "accountId",
    "name",
    "mobile_no",
    "state",
    "city",
    "point",
    "transactionId",
    "category",
    "status",
    "store",
    "orderId",
    "serialNo",
    "couponCode",
    "transaction_Medium",
    "scanManual",
    "transactionTime",
  ];
  const headers = {
    accountId: "Account Number",
    name: "Name",
    mobile_no: "Mobile No",
    state: "State",
    city: "City",
    point: "Point",
    transactionId: "Transaction Id",
    category: "Category",
    status: "Status",
    store: "Store",
    orderId: "Order Id",
    serialNo: "Serial No",
    couponCode: "Coupon Code",
    transaction_Medium: "Medium",
    scanManual: "Scan",
    transactionTime: "Transaction Time",
  };

  const filterApi = async (payload) => {
    const { endDate, startDate } = payload;
    // http://localhost:8090/script/filterTransactionData?startDate=2025-02-02&endDate=2025-02-20
    return apiCall(`/script/filterTransactionData?startDate=${startDate}&endDate=${endDate}&store=${selectedValue}`);
  };

  const handleFilterApply = (data) => {
    if (data === 'No transactions found' || data.length === 0) {
      setTransactions([]);
      return;
    }
    const formattedData = data?.map((transaction) => ({
      id: transaction?.id,
      transactionId: transaction?.transition_id,
      category: transaction?.transition_category,
      accountId: transaction?.account_number,
      customerId: transaction?.customer_Id,
      transaction_Medium: transaction?.medium,
      source: transaction?.source_of_device,
      point: transaction?.point,
      status: transaction?.transition_status,
      transactionType: transaction?.transactionType,
      registrationDate: transaction?.createdAt
        ? `${String(new Date(transaction?.createdAt).getDate()).padStart(2, '0')}/${String(new Date(transaction?.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(transaction?.createdAt).getFullYear()}`
        : '',
      expiryDate: transaction?.expiry_date
        ? transaction?.expiry_date.split('-').join('/')
        : '',
      transactionTime: transaction?.createdAt
        ? `${String(new Date(transaction?.createdAt).getDate()).padStart(2, '0')}/${String(new Date(transaction?.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(transaction.createdAt).getFullYear()}, ${String(new Date(transaction.createdAt).getHours()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getMinutes()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getSeconds()).padStart(2, '0')}`
        : '',
      orderId: transaction?.order_id,
      productDetails: transaction?.product_detail,
      name: transaction?.name,
      mobile_no: transaction?.mobile_no,
      state: transaction?.state,
      city: transaction?.city,
      couponCode: transaction?.coupon_code,
      scanManual: transaction?.scan_manual,
      serialNo: transaction?.serial_no,
    }));
    setTransactions(formattedData);
  };

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-2xl font-medium whitespace-nowrap">Migrated Transaction List</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search By Account No, Name, Transaction Id, Mobile No,"
            className="border border-gray-300 rounded-md px-4 py-2 w-[250px] sm:w-[350px] lg:w-[400px]"
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
            clear={fetchTransactions}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setShowFilterPopup(true)}
          >
            Filter
          </button>
          <div className="relative">
            <ExportDropdown
              data={transactions.map((item, index) => ({
                ...item,
                srno: index + 1,
              }))}
              filename="Transactions_List"
              columns={columns}
              headers={headers}
            />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto overflow-x-auto w-full">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b h-12 w-full">
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Sr. No
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Account Number
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Name
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Mobile No
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                State
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                City
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Point
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Transaction Id
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Category
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Status
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Store
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Order Id
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Serial No
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Coupon Code
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Medium
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Scan
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Transaction Time
              </th>
            </tr>
          </thead>
          <tbody>
            {currentList.length == 0 ? <tr>
              <td colSpan="12" className="p-4 text-center text-red-500">
                No data available
              </td>
            </tr> : <></>}
            {currentList?.map((transaction, index) => (
              <tr
                key={transaction?.id}
                className="border-b hover:bg-gray-50 h-12"
              >
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {indexOfFirst + index + 1}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.accountId}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left capitalize">
                  {transaction?.name}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.mobile_no}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.state}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.city}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.point}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.transactionId}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left capitalize">
                  {transaction?.category}
                </td>
                <td
                  className={`px-2 border-r text-sm whitespace-nowrap text-left ${transaction?.status === "register"
                    ? "text-blue-500"
                    : transaction?.status === "credit"
                      ? "text-green-500"
                      : transaction?.status === "hold"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                >
                  {transaction?.status}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.store}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.orderId}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.serialNo}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.couponCode}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.transaction_Medium}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.scanManual}
                </td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                  {transaction?.transactionTime}
                </td>
              </tr>
            ))}
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
    </div>
  );
};

export default MigratedTransaction;

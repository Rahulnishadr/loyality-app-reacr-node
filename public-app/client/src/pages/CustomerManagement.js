
import React, { useState, useEffect, useContext, useMemo } from "react";
import "jspdf-autotable";
import ExportDropdowns from "../reusable/Export_to_excel";
import ExportDropdown from "../reusable/ExportToExcelAll";
import { NavLink } from "react-router-dom";
import Filter from "../reusable/Filter";
import { apiCall } from "../api/Api";
import { showPopup } from '../reusable/Toast';
import Toast from '../reusable/Toast';
import LoaderSpiner from '../reusable/LoaderSpiner';
import { HeaderContext } from "../reusable/HeaderContext"
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import {
  useGetCustomerQuery,
  useGetSearchCustomerQuery,

} from "../api/apiSlice"
// import { HTTP_METHODS } from "../reusable/constants";
// import ExcelJS from "exceljs";
// import "jspdf-autotable";
// import { saveAs } from "file-saver";

const CustomerManagement = () => {

  const { selectedValue } = useContext(HeaderContext);
  const [showLoader, setShowLoader] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingg, setLoadingg] = useState(false);
  const [showPopupAddress, setShowPopupAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showPopupOpen, setShowPopupOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [FilterStart, setFilterStart] = useState('');
  const [FilterEnd, setFilterEnd] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageSize, setPageSize] = useState(50);

  const [formState, setFormState] = useState({
    startDate: "",
    endDate: "",
    status: "",
    brandName: "",
  });

  function useDebounce(value, delay = 1000) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timeout = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timeout);
    }, [value, delay]);
    return debouncedValue;
  }
  const debouncedSearchTerm = useDebounce(searchTerm, 1000); // delay of 500ms

  const shouldSearch = debouncedSearchTerm.trim().length > 3;


  const {
    data: normalData,
    error: normalError,
    isLoading: isNormalLoading,
  } = useGetCustomerQuery(
    {
      store: selectedValue,
      page: currentPage,
      limit: pageSize,
      startDate: FilterStart,
      endDate: FilterEnd
    },
    {
      skip: shouldSearch,
      refetchOnMountOrArgChange: true,
    }
  );
  // const { data: normalData, isLoading: isNormalLoading } = useGetCustomerQuery({ store: selectedValue, page: currentPage, limit: pageSize, startDate: FilterStart, endDate: FilterEnd }, { skip: shouldSearch, refetchOnMountOrArgChange: true, });
  const { data: searchData, isLoading: isSearchLoading } = useGetSearchCustomerQuery({ searchTerm, store: selectedValue }, { skip: !shouldSearch });

  // Decide which data to show
  // const data = shouldSearch ? searchData : normalData;
  const isLoading = shouldSearch ? isSearchLoading : isNormalLoading;


  const stableData = useMemo(() => {
    if (shouldSearch) return searchData;
    if (normalError?.status === 404) return [];
    return normalData;
  }, [shouldSearch, searchData, normalData, normalError]);

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setPageSize(50)
  };

  const handleEditCustomer = (customer) => {

    setSelectedCustomer(customer);
    setShowPopupOpen(true);
  };

  const handleClosePopup = () => {
    setShowPopupOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    setShowPopupAddress(true);
  };

  const closePopup = () => {
    setShowPopupAddress(false);
    setSelectedAddress("");
  };

  const reusableFunction = (data) => {
    const customerList = data.map((item) => ({
      id: item?.id,
      accountId: item?.account_number,
      firstName: item?.first_name,
      lastName: item?.last_name,
      customerId: item?.customer_id,
      mobileNo: item?.phone_number,
      alternateMobileNo: "",
      email: item?.email,
      date_of_birth: item?.date_of_birth
        ? (() => {
          const [year, month, day] = item.date_of_birth.split("-");
          return `${day}/${month}/${year}`;
        })()
        : "",
      earned_point: parseInt(item?.earned_point, 10),
      redeem_point: parseInt(item?.redeem_point, 10),
      expiry_point: parseInt(item?.expiry_point, 10),
      balance_point: parseInt(item?.balance_point, 10),
      State: item?.State,
      city: item?.city,
      country: item?.country,
      Distrtict: item?.Distrtict,
      pinCode: item?.zip,
      membershipTier: item?.membership_tier,
      addressLine1: item?.address1,
      addressLine2: item?.address2,
      notification: "",
      membershipStatus: item?.membership_status,
      registrationDate: item?.registration_date
        ? (() => {
          const date = new Date(item?.registration_date);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        })()
        : "",
      registrationTime: item?.registration_time,
    }));
    return customerList
  }


  useEffect(() => {
    if (Array.isArray(stableData)) {
      setTransactions([]);
      setTotalPages(0);
    } else if (stableData) {
      const result = reusableFunction(stableData?.data || []);
      setTransactions(result);
      setTotalPages(stableData?.totalPages || 0);
    }
  }, [stableData, currentPage, pageSize]);



  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      // await handleSearch();
    }
  };

  const headers = {
    accountId: "Account Number",
    firstName: "First Name",
    lastName: "Last Name",
    mobileNo: "Mobile No",
    date_of_birth: "Date Of Birth",
    earned_point: "Earn Points",
    redeem_point: "Redeem Points",
    expiry_point: "Expired Points",
    balance_point: "Balance Points",
    State: "State",
    city: "City",
    Distrtict: "District",
    pinCode: "Pin Code",
    membershipTier: "Membership Tier",
    addressLine1: "Address Line 1",
    addressLine2: "Address Line 2",
    notification: "Notification",
    membershipStatus: "Membership Status",
    registrationDate: "Registration Date",
    registrationTime: "Registration Time",
  };
  const columns = [
    "accountId",
    "firstName",
    "lastName",
    "mobileNo",
    "date_of_birth",
    "earned_point",
    "redeem_point",
    "expiry_point",
    "balance_point",
    "State",
    "city",
    "Distrtict",
    "pinCode",
    "membershipTier",
    "addressLine1",
    "addressLine2",
    "notification",
    "membershipStatus",
    "registrationDate",
    "registrationTime",
  ];

  const handleUpdate = async () => {
    setLoadingg(true);

    if (!selectedCustomer) return;
    try {
      const payload = {
        first_name: selectedCustomer?.firstName,
        last_name: selectedCustomer?.lastName,
        phone_number: selectedCustomer?.mobileNo,
        email: selectedCustomer?.email,
        address1: selectedCustomer?.addressLine1,
        address2: selectedCustomer?.addressLine2,
        city: selectedCustomer?.city,
        State: selectedCustomer?.State,
        country: selectedCustomer?.country,
        zip: selectedCustomer?.pinCode,
      };
      const response = await apiCall(`/customer/customerUpdate?id=${selectedCustomer.id}&customer_id=${selectedCustomer.customerId}&store=${selectedValue}`, "PUT", payload);
      if (response.status === 200) {
        setSelectedCustomer(null);
        showPopup("success", "Customer Updated Successfully");
      }
      setLoadingg(false);
    } catch (error) {
      showPopup("error", "Failed to update customer details.");
      console.error("Error updating customer details:", error);
    }
  };

  const filterApi = async (payload) => {
    const { endDate, startDate } = payload;
    setFilterStart(startDate)
    setFilterEnd(endDate)
    // return apiCall(`/customer/customerName?start_date=${startDate}&end_date=${endDate}&store=${selectedValue}`);
  };

  const handleFilterApply = (data) => {
    if (data === 'No transactions found' || data.length === 0) {
      setTransactions([]);
      return;
    }
    const result = reusableFunction(data?.data)
    setTotalPages(data?.totalPages);
    setTransactions(result);
    // setPageSize(500)
  };
  //  console.log(formState,"formState")
  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {(isLoading || showLoader) && <LoaderSpiner text="Loading ..." />}

      {/* {isLoading ||showExportPopup && <LoaderSpiner text="Loading ..." />} */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-2xl font-medium whitespace-nowrap">Customer List</h1>
        <div className="flex items-center space-x-4">
          {/* <input
            type="text"
            placeholder="Search By Account No, Mobile No"
            className="border border-gray-300 rounded-md px-4 py-2 w-[250px] sm:w-[350px] lg:w-[400px]"
            value={searchTerm}
            onChange={handleSearchChange}
          /> */}
          <input
            type="text"
            placeholder="Search By Account No, Mobile No"
            className="border border-gray-300 rounded-md px-4 py-2 w-[250px] sm:w-[350px] lg:w-[400px]"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
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
            // clear={fetchCustomerData}
            formState={formState}
            setFormState={setFormState}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setShowFilterPopup(true)}
          >Filter </button>

          <div className="relative">
            {searchTerm ? <>
              <ExportDropdowns
                data={transactions.map((item, index) => ({
                  ...item,
                  srno: index + 1,
                }))}
                filename="Customer_List"
                columns={columns}
                headers={headers}
              />
            </> : <>
              <ExportDropdown
                url='/points/customerMigrationExport'
                status='customerList'
                filterStartDate={formState?.startDate}
                filterStartEnd={formState?.endDate}
                columns={columns}
                headers={headers}
                setShowLoader={setShowLoader}
              />
            </>}
          </div>

        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b h-12">
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Sr. No
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Account Number
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                First Name
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Last Name
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Mobile No
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Date Of Birth
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Earn Points
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Redeem Points
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Expired Points
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Balance Points
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                State
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                City
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                District
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Pin Code
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Membership Tier
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Address Line 1
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Address Line 2
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Notification
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Membership Status
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Registration Date{" "}
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Registration Time
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                View Details
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length === 0 ? (<tr>
              <td colSpan="12" className="text-center text-red-500 py-4">
                No data available
              </td>
            </tr>) : (
              transactions?.map((transaction, index) => (
                <tr
                  key={transaction?.id}
                  className="border-b hover:bg-gray-50 h-12"
                >
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {index + 1}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.accountId}
                  </td>
                  <td
                    className="px-2 border-r capitalize text-sm font-medium whitespace-nowrap text-left cursor-pointer text-blue-500 hover:underline"
                    onClick={() => handleEditCustomer(transaction)}
                  >
                    {transaction?.firstName}
                  </td>
                  <td className="px-2 border-r capitalize text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.lastName}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.mobileNo}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.date_of_birth}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.earned_point}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.redeem_point}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.expiry_point}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.balance_point}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.State}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.city}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.Distrtict}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.pinCode}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.membershipTier}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    <span
                      onClick={() => handleAddressClick(transaction?.addressLine1)}
                      className="cursor-pointer"
                    >
                      {transaction.addressLine1?.length > 25
                        ? `${transaction.addressLine1.slice(0, 25)}.....`
                        : transaction.addressLine1}
                    </span>
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.addressLine2}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.notification}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.membershipStatus}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.registrationDate}
                  </td>

                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {transaction?.registrationTime}
                  </td>
                  {selectedValue === 'rajnigandha' ? <>
                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap flex justify-center">

                      <NavLink
                        to={`/seller-details/${transaction.id}`}
                        state={{
                          firstName: transaction?.firstName,
                          lastName: transaction?.lastName,

                          accountId: transaction?.accountId,
                          balance_point: transaction?.balance_point,
                          membershipTier: transaction?.membershipTier,
                          mobileNo: transaction?.mobileNo,
                          email: transaction?.email,
                          pinCode: transaction?.pinCode,
                        }}
                      >
                        <button className="bg-sky-500 text-white px-2 py-1 rounded-md mt-2">
                          Info
                        </button>
                      </NavLink>
                    </td>
                  </> : <>
                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap flex justify-center">

                      <NavLink
                        to={`/rclub/seller-details/${transaction.id}`}
                        state={{
                          firstName: transaction?.firstName,
                          lastName: transaction?.lastName,

                          accountId: transaction?.accountId,
                          balance_point: transaction?.balance_point,
                          membershipTier: transaction?.membershipTier,
                          mobileNo: transaction?.mobileNo,
                          email: transaction?.email,
                          pinCode: transaction?.pinCode,
                        }}
                      >
                        <button className="bg-sky-500 text-white px-2 py-1 rounded-md mt-2">
                          Info
                        </button>
                      </NavLink>
                    </td>
                  </>}
                </tr>
              )))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        <div className="mt-4">
          {/* <h1>Total Customers : {totalCustomers}</h1> */}
        </div>
        <div className="flex items-center mt-4">
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Rows</InputLabel>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Rows"
            >
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={200}>200</MenuItem>
              <MenuItem value={500}>500</MenuItem>
            </Select>
          </FormControl>

          {totalPages > 1 && (
            <Stack spacing={2} className="items-center">
              <Pagination
                count={totalPages}
                page={currentPage}
                color="primary"
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                size="large"
                siblingCount={1}
                boundaryCount={1}
                showFirstButton
                showLastButton
              />
            </Stack>
          )}
        </div>
      </div>


      {showPopupAddress && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-lg font-bold mb-4">Full Address</h2>
            <p className="text-sm mb-6">{selectedAddress}</p>
            <div className="text-end">
              <button
                onClick={closePopup}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}




      {showPopupOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
          <div className="bg-white px-12 py-6 rounded-lg shadow-xl w-3/5">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 border-b">
              Customer Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={selectedCustomer.firstName}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, firstName: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={selectedCustomer.lastName || ""}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, lastName: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Mobile No</label>
                <input
                  type="text"
                  value={selectedCustomer.mobileNo || ""}
                  onChange={(e) => {
                    if (e.target.value.length <= 13) {
                      setSelectedCustomer({ ...selectedCustomer, mobileNo: e.target.value })
                    }
                  }
                  }
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    if (!/^\d*$/.test(e.clipboardData.getData("Text"))) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Email </label>
                <input
                  type="email"
                  value={selectedCustomer.email || ""}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, email: e.target.value })
                  }
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Address Line 1</label>
                <textarea
                  value={selectedCustomer.addressLine1 || ""}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, addressLine1: e.target.value })
                  }
                  rows="1"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Address Line 2</label>
                <textarea
                  value={selectedCustomer.addressLine2 || ""}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, addressLine2: e.target.value })
                  }
                  rows="1"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={selectedCustomer.pinCode || ""}
                  onChange={(e) => {
                    if (e.target.value.length <= 6) {
                      setSelectedCustomer({ ...selectedCustomer, pinCode: e.target.value })
                    }
                  }}
                  onKeyPress={(e) => {
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    if (!/^\d*$/.test(e.clipboardData.getData("Text"))) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={selectedCustomer.State || ""}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, State: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={selectedCustomer.country || ""}
                  onChange={(e) =>
                    setSelectedCustomer({ ...selectedCustomer, country: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

            </div>
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Close
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loadingg}
              >
                {loadingg ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Toast />
    </div>
  );
};

export default CustomerManagement;

import React, { useState, useEffect, useContext, useMemo } from "react";
import "jspdf-autotable";
import Filter from "../reusable/Filter";
import ExportDropdown from "../reusable/ExportToExcelAll";
import ExportDropdowns from "../reusable/Export_to_excel";
import LoaderSpiner from '../reusable/LoaderSpiner';
// import { showPopup } from "../reusable/Toast";
import { HeaderContext } from "../reusable/HeaderContext";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import {
  useGetTransactionsQuery,
  useGetSearchTransactionsQuery
} from '../api/apiSlice';


const TransactionManagement = () => {

  const { selectedValue } = useContext(HeaderContext);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
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

  // -----------debouncedValue-------

  function useDebounce(value, delay = 1000) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timeout = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timeout);
    }, [value, delay]);
    return debouncedValue;
  }
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const shouldSearch = debouncedSearchTerm.trim().length > 3;
  // const shouldSearch = searchTerm.trim().length > 3;

  const {
    data: normalData,
    isLoading: isNormalLoading,
    error: normalError,
  } = useGetTransactionsQuery(
    { store: selectedValue, page: currentPage, limit: pageSize, startDate: FilterStart, endDate: FilterEnd },
    { skip: shouldSearch }
  );

  const {
    data: searchData,
    isLoading: isSearchLoading
  } = useGetSearchTransactionsQuery(
    { searchTerm, store: selectedValue },
    { skip: !shouldSearch }
  );
  // Decide which data to show 
  // const data = shouldSearch ? searchData : normalData; 
  const isLoading = shouldSearch ? isSearchLoading : isNormalLoading;

  useEffect(() => {

  }, [isNormalLoading]);

  // const data = shouldSearch ? searchData ?? [] : normalData ?? [];
  const stableData = useMemo(() => {
    if (shouldSearch) return searchData;
    if (normalError?.status === 404) return [];
    return normalData;
  }, [shouldSearch, searchData, normalData, normalError]);


  const reusableFunction = (data) => {
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
      // transactionTime: transaction?.createdAt
      //   ? `${String(new Date(transaction?.createdAt).getDate()).padStart(2, '0')}/${String(new Date(transaction?.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(transaction.createdAt).getFullYear()}, ${String(new Date(transaction.createdAt).getHours()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getMinutes()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getSeconds()).padStart(2, '0')}`
      //   : '',
      transactionTime: transaction?.createdAt
        ? `${String(new Date(transaction.createdAt).getUTCDate()).padStart(2, '0')}/${String(new Date(transaction.createdAt).getUTCMonth() + 1).padStart(2, '0')
        }/${new Date(transaction.createdAt).getUTCFullYear()}, ${String(new Date(transaction.createdAt).getUTCHours()).padStart(2, '0')
        }:${String(new Date(transaction.createdAt).getUTCMinutes()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getUTCSeconds()).padStart(2, '0')
        }`
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
    return formattedData
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


  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setPageSize(50)

  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      // await handleSearch(); 
    }
  };

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
    setFilterStart(startDate)
    setFilterEnd(endDate)
    // return apiCall(`/customer/allTransition?start_date=${startDate}&end_date=${endDate}&store=${selectedValue}`);
  };

  const handleFilterApply = (data) => {
    if (data?.data === 'No transactions found' || data.length === 0) {
      setTransactions([]);
      setTotalPages('');
      return;
    }
    const result = reusableFunction(data?.data)
    setTotalPages(data?.totalPages);
    setTransactions(result);
    setPageSize(50)
  };

  // console.log(isLoading)
  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {(isLoading || showLoader) && <LoaderSpiner text="Loading ..." />}
      {/* {showLoader && <LoaderSpiner text="Loading ..." />} */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-2xl font-medium whitespace-nowrap">Transaction List</h1>
        <div className="flex items-center space-x-4">

          <input
            type="text"
            placeholder="Search By Account No, Name, Transaction Id, Mobile No"
            className="border border-gray-300 rounded-md px-4 py-2 w-[250px] sm:w-[350px] lg:w-[400px]"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown} // <-- Add this!
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
            formState={formState}
            setFormState={setFormState}

          // clear={fetchTransactions}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setShowFilterPopup(true)}
          >
            Filter
          </button>

          <div className="relative">
            {searchTerm ? <>
              <ExportDropdowns
                data={transactions?.map((item, index) => ({
                  ...item,
                  srno: index + 1,
                }))}
                filename="Transactions_List"
                columns={columns}
                headers={headers}
              />
            </> : <>
              <ExportDropdown
                url='/points/transitionMigrationExport'
                status='transition'
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
            {transactions?.length == 0 ? <tr>
              <td colSpan="12" className="p-4 text-center text-red-500">
                No data available
              </td>
            </tr> : <></>}
            {transactions?.map((transaction, index) => (
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
                  {transaction?.status === "hold" ? "upcoming" : transaction?.status}
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

      <div className="mt-4 flex justify-between">
        <div className="mt-4">
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

    </div>
  );
};

export default TransactionManagement;

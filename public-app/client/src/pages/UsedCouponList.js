import React, { useState, useContext, useEffect } from 'react';
import 'jspdf-autotable';
import { apiCall } from '../api/Api';
import LoaderSpiner from '../reusable/LoaderSpiner';
import ExportDropdowns from '../reusable/Export_to_excel';
import ExportDropdown from '../reusable/ExportToCoupon';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showPopup } from '../reusable/Toast';
import Toast from '../reusable/Toast';
import { HeaderContext } from "../reusable/HeaderContext"
import CustomModal from '../reusable/CustomModal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { useGetUseSearchCouponQuery, useGetUsedCouponQuery } from "../api/apiSlice"
const UsedCouponList = () => {

  // const { selectedValue } = useContext(HeaderContext);
  const { selectedValue = "rajnigandha" } = useContext(HeaderContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [originalData, setOriginalData] = useState([]);

  console.log(tableData, "tableData")
  const [transactions, setTransactions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageSize, setPageSize] = useState(50);


  function useDebounce(value, delay = 1000) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timeout = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timeout);
    }, [value, delay]);
    return debouncedValue;
  }
  const debouncedSearchTerm = useDebounce(searchTerm, 1500); // delay of 500ms

  const shouldSearch = debouncedSearchTerm.trim().length > 3;


  const { data: normalData, isLoading: isNormalLoading } = useGetUsedCouponQuery({ store: selectedValue, page: currentPage, limit: pageSize }, { skip: shouldSearch });
  const { data: searchData, isLoading: isSearchLoading } = useGetUseSearchCouponQuery({ store: selectedValue, page: currentPage, search: debouncedSearchTerm },
    { skip: !shouldSearch }
  );

  const datas = shouldSearch ? searchData : normalData;


  useEffect(() => {
    setShowLoader(shouldSearch ? isSearchLoading : isNormalLoading);
  }, [shouldSearch, isSearchLoading, isNormalLoading]);

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const reusableFunction = (data) => {
    const formattedData = data.map((item) => ({
      id: item?.id,
      couponBatchId: item?.couponBatchId,
      product: item?.product,
      productSKU: item?.productSKU,
      sno: item?.sno,
      couponNumber: item?.code,
      accountNumber: item?.account_number,
      email: item?.email,
      phoneNumber: item?.phone_number,
      points: item?.points,
      startDate: item?.stdate,
      endDate: item?.enddate,
      createdAt: item?.createdAt
        ? new Date(item?.createdAt).toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        : "", redemptionDate: item?.rdate
          ? new Date(item.rdate).toLocaleDateString("en-GB")
          : "",
      status: item?.status,
      source: item?.source,
      couponAccessed: item?.couponAccessed,
    }));
    return formattedData
  }
  useEffect(() => {
    if (datas) {
      const result = reusableFunction(datas?.data)
      setTotalPages(1);
      setTotalPages(datas?.totalPages);
      setTransactions(result);
      setTableData(result);
    }
  }, [datas, currentPage, pageSize]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);

  };

  const [formState, setFormState] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  function reverseDateFormat(date) {
    const [day, month, year] = date.split('/');
    const fullYear = year;
    return `${fullYear}${month}${day}`;
  }

  const handleFieldChange = (field, value) => {

    // const {name ,value}=e.target
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  // const handleApplyFilter = () => {

  //   var { startDate, endDate, status } = formState;
  //   startDate = startDate.replaceAll('-', '')
  //   endDate = endDate.replaceAll('-', '')
  //   const filteredData = tableData?.filter(number =>
  //     !(status && number['expiryStatus'] !== status) &&
  //     !(startDate && startDate > reverseDateFormat(number['startDate'])) &&
  //     !(endDate && endDate < reverseDateFormat(number['endDate']))
  //   );

  //   // setTableData(filteredData);
  //   setTransactions(filteredData)
  //   setOpen(false)

  //   setFormState(() => ({
  //     startDate: "",
  //     endDate: "",
  //     status: "",
  //   }));
  // };

  const handleApplyFilter = () => {
    fetchData()
    var { startDate, endDate, status } = formState;
    startDate = startDate.replaceAll('-', '')
    endDate = endDate.replaceAll('-', '')

    const filteredData = originalData?.filter(number =>
      !(status && number['expiryStatus'] !== status) &&
      !(startDate && startDate > reverseDateFormat(number['startDate'])) &&
      !(endDate && endDate < reverseDateFormat(number['endDate']))
    );

    setTableData(filteredData);
    // setOpen(false)

    setFormState(() => ({
      startDate: "",
      endDate: "",
      status: "",
    }));
  };

  const formContent = (
    <div className="flex justify-center items-center ">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filter </h2>
          <button
            className="text-red-500 hover:bg-gray-100 rounded-full p-1"
          // onClick={() => onFilterApply(null)} // Close the modal
          >
            {/* <CloseIcon /> */}
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block mb-1 text-gray-700">Start Date</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formState.startDate}
              onChange={(e) => handleFieldChange("startDate", e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block mb-1 text-gray-700">End Date</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formState.endDate}
              onChange={(e) => handleFieldChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={async () => {
              setFormState({ startDate: "", endDate: "" });
              // await fetchData();
              setOpen(false);
            }}
          >
            Clear Date
          </button>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleApplyFilter}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );


  const fetchData = async () => {
    setShowLoader(true);
    var { startDate, endDate } = formState;
    try {
      const response = await apiCall(
        `/coupon/usedcouponlist?start_date=${startDate}&end_date=${endDate}&search=${searchTerm}&store=${selectedValue}`,
        "GET",
        {}
      );

      if (response.status === 200) {
        const data = response.data;
        setOpen(false)
        // Format the data as needed
        const formattedData = data.map((item) => ({
          id: item?.id,
          couponBatchId: item?.couponBatchId,
          product: item?.product,
          productSKU: item?.productSKU,
          sno: item?.sno,
          couponNumber: item?.code,
          accountNumber: item?.account_number,
          email: item?.email,
          phoneNumber: item?.phone_number,
          points: item?.points,
          startDate: item?.stdate,
          endDate: item?.enddate,
          createdAt: item?.createdAt
            ? new Date(item?.createdAt).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            : "", redemptionDate: item?.rdate
              ? new Date(item.rdate).toLocaleDateString("en-GB")
              : "",
          status: item?.status,
          source: item?.source,
          couponAccessed: item?.couponAccessed,
        }));
        setTransactions(formattedData);
        setTotalPages(formattedData)
        setTableData(formattedData);
        setOriginalData(formattedData);
        setShowLoader(false);
      } else {
        console.error("Unexpected response format:", response?.data);
        setTableData([]);
        setOriginalData([]);
        setShowLoader(false);
      }
    } catch (error) {
      setShowLoader(false);
      showPopup("error", "Failed to fetch data. Please try again.");
    }
    finally {
      setShowLoader(false)
    }
  };


  const columns = [
    // "couponBatchId",
    "product",
    "productSKU",
    "sno",
    "couponNumber",
    "accountNumber",
    "email",
    "phoneNumber",
    "points",
    "createdAt",
    "startDate",
    "endDate",
    "redemptionDate",
    "status",
    "source",
    "couponAccessed",

  ];
  const headers = {
    // couponBatchId: "Coupon Batch Id",
    product: "Product Name",
    productSKU: "Product Sku",
    sno: "Serial No",
    couponNumber: "Code",
    accountNumber: "Account Number",
    email: "Email",
    phone_number: "Mobile No",
    points: "Reward Point",
    createdAt: "Created At",
    startDate: "Start Date",
    endDate: "End Date",
    redemptionDate: "Redeem Date",
    status: "Status",
    source: "Source",
    couponAccessed: "couponAccessed",
  };


  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <ToastContainer />
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-2xl font-medium"> Used Coupon List</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search By Account No, Mobile No, Serial No, Code"
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-3/4 lg:w-[400px]"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <CustomModal
            open={open}
            handleClose={handleClose}
            description={formContent}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setOpen(true)}
          >
            Filter
          </button>
          {searchTerm ? <>
            <ExportDropdowns
              data={tableData.map((item, index) => ({
                ...item,
                srno: index + 1,
              }))}
              filename="Used_Coupon_List"
              columns={columns}
              headers={headers}
            />
          </> : <>
            <ExportDropdown
              url='/points/CouponMigrationExport'
              status='Used'
              filterStartDate={formState?.startDate}
              filterStartEnd={formState?.endDate}
              columns={columns}
              headers={headers}
              setShowLoader={setShowLoader}
            />
          </>}
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto w-full">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b h-12">
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Sr. No</th>
              {/* <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Coupon Batch Id</th> */}
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Product Name</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Product Sku</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Serial No</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Code</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Account Number</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Email</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Mobile No</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Reward Point</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Created At</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Start Date</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">End Date</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Redeem Date</th>
              {/* <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Redeem Date</th> */}
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Status</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Source</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">couponAccessed</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 h-12">
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {index + 1}
                  </td>
                  {/* <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.couponBatchId}
                  </td> */}
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.product}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.productSKU}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.sno}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.couponNumber}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.accountNumber}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.email}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.phoneNumber}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.points}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.createdAt}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.startDate}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.endDate}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.redemptionDate}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.status}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.source}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item?.couponAccessed}
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
      <Toast />
    </div>
  );
};

export default UsedCouponList;
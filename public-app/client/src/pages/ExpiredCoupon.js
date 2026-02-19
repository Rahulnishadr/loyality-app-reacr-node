import React, { useState, useContext, useEffect } from "react";
import { apiCall } from "../api/Api";
import LoaderSpiner from "../reusable/LoaderSpiner";
import ExportDropdowns from "../reusable/Export_to_excel";
import ExportDropdown from "../reusable/ExportToCoupon";
import { HeaderContext } from "../reusable/HeaderContext";
import { showPopup } from '../reusable/Toast';
import CustomModal from "../reusable/CustomModal";
import msg from "../reusable/msg.json";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { useGetExpireCouponQuery } from "../api/apiSlice"

const ExpiredCoupon = () => {
  const { selectedValue = "rajnigandha" } = useContext(HeaderContext);
  const [originalData, setOriginalData] = useState([]);
  const [expiredCoupons, setExpiredCoupons] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  // const [startDate, setStartDate] = useState("");
  console.log(tableData)
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


  const { data: normalData, isLoading: isNormalLoading } = useGetExpireCouponQuery({ store: selectedValue, page: currentPage, limit: pageSize }, { skip: shouldSearch });
  const { data: searchData, isLoading: isSearchLoading } = useGetExpireCouponQuery({ store: selectedValue, page: currentPage, search: debouncedSearchTerm },
    { skip: !shouldSearch });
  const datas = shouldSearch ? searchData : normalData;

  useEffect(() => {
    setShowLoader(shouldSearch ? isSearchLoading : isNormalLoading);
  }, [shouldSearch, isSearchLoading, isNormalLoading]);

  const reusableFunction = (data) => {
    const formattedData = data.map((item) => ({
      id: item?.id,
      sno: item?.sno,
      couponno: item?.code,
      createdBy: item?.createdBy,
      product: item?.product,
      productSKU: item?.productSKU,
      points: item?.points,
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
        : "",

      status: item?.status,
      stdate: item?.stdate,
      enddate: item?.enddate,
      startTime: item?.startTime,
      endTime: item?.endTime
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



  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };


  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);

  };
  const [formState, setFormState] = useState({
    startDate: "",
    endDate: "",
    // status: "",
  });
  function reverseDateFormat(date) {

    const [day, month, year] = date.split('/');
    const fullYear = year;
    return `${fullYear}${month}${day}`;
  }

  const handleApplyFilter = () => {
    fetchExpiredCoupons()
    var { startDate, endDate } = formState;

    startDate = startDate.replaceAll('-', '')
    endDate = endDate.replaceAll('-', '')

    const filteredData = originalData?.filter(number =>
      !(startDate && startDate > reverseDateFormat(number['stdate'])) &&
      !(endDate && endDate < reverseDateFormat(number['enddate']))
    );
    setTableData(filteredData)
    setExpiredCoupons(filteredData);
    setFormState(() => ({
      startDate: "",
      endDate: "",
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
              await fetchExpiredCoupons();
              setFormState(() => ({
                startDate: "",
                endDate: "",
                status: "",
              }));
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

  const handleFieldChange = (field, value) => {

    // const {name ,value}=e.target
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchExpiredCoupons()
    }, 500);
    return () => clearTimeout(debounce)
  }, [searchTerm])


  // useEffect(() => {
  //   fetchExpiredCoupons()
  // }, [selectedValue, currentPage, pageSize])


  const fetchExpiredCoupons = async () => {
    setShowLoader(true);
    var { startDate, endDate } = formState;
    try {
      const response = await apiCall(
        `/coupon/expiredcouponlist?start_date=${startDate}&end_date=${endDate}&search=${searchTerm}&store=${selectedValue}`,
        "GET",
        {}
      );

      if (response.status === 200) {
        const data = response.data;
        setOpen(false)
        const formattedData = data.map((item) => ({
          id: item?.id,
          sno: item?.sno,
          couponno: item?.code,
          createdBy: item?.createdBy,
          product: item?.product,
          productSKU: item?.productSKU,
          points: item?.points,
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
            : "",

          status: item?.status,
          stdate: item?.stdate,
          enddate: item?.enddate,
          startTime: item?.startTime,
          endTime: item?.endTime
        }));
        setTransactions(formattedData)
        setTotalPages(formattedData)
        setExpiredCoupons(formattedData);
        setOriginalData(formattedData);
      } else {
        setExpiredCoupons([]);
        setOriginalData([])
      }
    } catch (error) {
      console.error("Error fetching expired coupons:", error);
      showPopup("error", "Failed to fetch expired coupons. Please try again.");
      setExpiredCoupons([]);
    } finally {
      setShowLoader(false);
    }
  };

  const columns = [
    // "srno",
    "product",
    "productSKU",
    "sno",
    "couponno",
    "points",
    "stdate",
    "enddate",
    "startTime",
    "endTime",
    "status",
    "createdAt",
    "createdBy",

  ];

  const headers = {
    // srno: "Sr. No",
    product: "Product Name",
    productSKU: "Product SKU",
    sno: "Serial No",
    couponno: "Code",
    points: "Reward Point",
    stdate: "Start Date",
    enddate: "End Date",
    startTime: "Start Time",
    endTime: "End Time",
    status: "Status",
    createdAt: "Created At",
    createdBy: "Created By",
  };


  const handleDelete = async (id) => {
    if (id == 'read') {
      showPopup('success', msg.readOnly)
    } else {
      try {

        const response = await apiCall(
          `/coupon/deleteExpiredCoupon?id=${id}`,
          "DELETE",
          {}
        );

        if (response.status === 200) {
          fetchExpiredCoupons();
          showPopup("error", "Coupon deleted successfully!");
        }
      } catch (error) {
        console.error('Error deleting module:', error?.response?.data?.message?.errors || error?.message);
        showPopup(error?.response?.data?.message?.errors || error?.message, 'error');
      }
    }
  };

  const data = {};

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-2xl font-medium">Expired List</h1>
        <div className="flex space-x-2">


          <input
            type="text"
            placeholder="Search By Product Name, Serial No, Code"
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
            onClick={() => {
              setOpen(true)
            }

            }
          >
            Filter
          </button>
          {searchTerm ? <>
            <ExportDropdowns
              data={expiredCoupons.map((item, index) => ({
                ...item,
                srno: index + 1,
              }))}
              filename="Expired_Coupon_List"
              columns={columns}
              headers={headers}
            />
          </> : <>
            <ExportDropdown
              url='/points/CouponMigrationExport'
              status='Expired'
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
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Sr. No
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Product Name
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Serial No
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Code
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Reward Point
              </th>

              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Start Date
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                End Date
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Status
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Created At
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Created By
              </th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length > 0 ? (
              transactions?.map((coupon, index) => (
                <tr key={coupon?.id} className="border-b hover:bg-gray-50 h-12">
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {index + 1}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.product}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.sno}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.couponno}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.points}
                  </td>

                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.stdate}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.enddate}
                  </td>
                  {/* <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.createdAt}
                  </td> */}
                  {/* <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.stdate}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.enddate}
                  </td> */}
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.status}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.createdAt}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {coupon?.createdBy}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {/* <EditIcon // Will be added in phase 2
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleOpenPopup(coupon?.id, coupon?.stdate, coupon?.enddate)}
                    /> */}
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(coupon?.id)}
                      aria-label="Delete entry"
                    >
                      <i className="fas fa-trash"></i>
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-red-500">
                  No data available
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

      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[450px] p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Update</h2>
              <button
                onClick={handleClosePopup}
                className="text-red-500 hover:text-red-700 font-medium text-xl"
              >
                ✖
              </button>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiredCoupon;
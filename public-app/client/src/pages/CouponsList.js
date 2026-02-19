import React, { useState, useContext, useEffect } from "react";
import "jspdf-autotable";
import { apiCall } from "../api/Api";
import LoaderSpiner from "../reusable/LoaderSpiner";
import ExportDropdown from "../reusable/ExportToCoupon";
import ExportDropdowns from "../reusable/Export_to_excel";
import msg from "../reusable/msg.json";
import Toast from "../reusable/Toast";
import { HeaderContext } from "../reusable/HeaderContext";
import { showPopup } from "../reusable/Toast";
import CustomModal from "../reusable/CustomModal";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { useGetCouponQuery, useGetSearchCouponQuery } from "../api/apiSlice"
const CouponsList = () => {


  const { selectedValue = "rajnigandha" } = useContext(HeaderContext);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [duplicates, setDuplicates] = useState([]);


  const [showLoader, setShowLoader] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [importEnable, setImportEnable] = useState(false);
  const [filePath, setFilePath] = useState("");
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


  const { data: normalData, isLoading: isNormalLoading } = useGetCouponQuery({ store: selectedValue, page: currentPage, limit: pageSize, }, { skip: shouldSearch });
  // console.log("normalData", normalData)

  const { data: searchData, isLoading: isSearchLoading } = useGetSearchCouponQuery({ store: selectedValue, page: currentPage, search: debouncedSearchTerm },
    { skip: !shouldSearch }
  );

  // Decide which data to show
  const datas = shouldSearch ? searchData : normalData;

  

  useEffect(() => {
    setShowLoader(shouldSearch ? isSearchLoading : isNormalLoading);
  }, [shouldSearch, isSearchLoading, isNormalLoading]);


  const reusableFunction = (data) => {
    const formattedData = data.map((item) => ({
      id: item.id,
      product: item.product,
      productSKU: item.productSKU,
      sno: item.sno,
      couponNumber: item.code,
      noOfCoupon: item.noOfCoupon,
      couponBatchId: item.couponBatchId,
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        : "",
      startDate: item.stdate,
      endDate: item.enddate,
      startTime: item.startTime,
      endTime: item.endTime,
      points: item.points,
      createdBy: item.createdBy,
      status: item.status,
      QRcode: item.QRcode,
      QRcodes: item.QRCodes,
      updatedBy: item.createdBy,
      couponAccessed: item.couponAccessed,
      source: item.source,
    }));
    return formattedData
  }
  useEffect(() => {
    if (datas) {
      const result = reusableFunction(datas?.data)
      // setTotalPages(1);
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
    setPageSize(500)
  };


  const handleSearchChange = (event) => {
    const value = event.target.value.trim();
    setSearchTerm(value);
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

  const handleFieldChange = (field, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const clearAllFilter = () => {
    setSearchTerm("");
    setFormState({
      startDate: "",
      endDate: "",
      status: ""
    });
    setOpen(false)
    setCurrentPage(1);
  }

  const handleApplyFilter = () => {
    setOpen(false);
    fetchData();
    setCurrentPage(1);
  };
  const fetchData = async () => {
    setShowLoader(true);
    try {
      let couponList = `/coupon/list?store=${selectedValue}&status=${formState?.status}&start_date=${formState?.startDate}&end_date=${formState?.endDate}`;

      // let couponList = `/coupon/list?store=${selectedValue}&page=${currentPage}`;
      // let hasFilter = false;
      // if (searchTerm && searchTerm.length > 0) {
      //   couponList += `&search=${searchTerm}`
      //   hasFilter = true;
      // } else {
      //   couponList += `&limit=${pageSize}`
      // } 
      // if (formState?.status) {
      //   couponList += hasFilter ? `&status=${formState?.status}` : `status=${formState?.status}`
      //   hasFilter = true;
      // }
      // if (formState?.startDate) {
      //   couponList += hasFilter ? `&start_date=${formState?.startDate}` : `start_date=${formState?.startDate}`
      //   hasFilter = true;
      // }
      // if (formState?.endDate) {
      //   couponList += hasFilter ? `&end_date=${formState?.endDate}` : `end_date=${formState?.endDate}`
      //   hasFilter = true;
      // }
      const response = await apiCall(couponList, "GET");

      if (response.status === 200) {
        const data = response; 
        let result = reusableFunction(data?.data)
        setTotalPages(data?.totalPages);
        setTransactions(result);
        setTableData(result);
        setShowLoader(false);  
        // setPageSize(500)

      } else {
        // console.error("Unexpected response format:", response.data);
        setTableData([]);
        setTransactions([])
        setShowLoader(false);
      }
    } catch (error) {
      setShowLoader(false);
      showPopup("error", error.message);
    }
    finally {
      setShowLoader(false)
    }
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

          {/* Status */}
          <div className="col-span-2">
            <label className="block mb-1 text-gray-700">Status</label>
            <select
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={formState.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={clearAllFilter}
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = /(\.xls|\.xlsx)$/i;

    if (file) {
      if (!allowedExtensions.test(file.name)) {
        showPopup("warning", "Please upload a valid Excel file (.xls or .xlsx).");
        e.target.value = "";
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const fileScan = async () => {
    if (selectedFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("store", selectedValue);
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      setShowLoader(true);
      try {
        const response = await apiCall(
          "/coupon/checkCouponDuplicates",
          "POST",
          formData,
          headers
        );
        setFilePath(response.filePath);
        // const totalRecords = response.data?.totalRecords;
        setIsLoading(false);
        setShowLoader(false);
        setIsPopupOpen(false);
        setIsQrOpen(false);
        // showPopup("success", `${totalRecords} Coupons Import Successfully`);
        setImportEnable(true);
      } catch (error) {

        const responseData = error.duplicates;

        setShowLoader(false);
        setErrorMessage(responseData?.message);
        if (error?.limitExceed) {

          showPopup("error", error.message);
          return;
        }
        setIsErrorModalOpen(true);
        setDuplicates(error.invalidRows || []);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImport = async () => {
    setIsLoading(true);

    const headers = {};
    setShowLoader(true);
    try {
      const response = await apiCall(
        "/coupon/couponImport",
        "POST",
        {
          couponFile: {
            filePath: filePath
          }
        },
        headers
      );
      if (response) {
        setFilePath(null);
        const timeInSeconds = response.data?.timeTaken;
        const timeInMilliseconds = timeInSeconds * 1000;
        setTimeout(() => {

          setIsLoading(false);
          setShowLoader(false);
          // fetchData();
        }, timeInMilliseconds);
        setIsPopupOpen(false);
        setIsQrOpen(false);
        setShowLoader(false);
        // showPopup("success", `${totalRecords} Coupons Import Successfully`);
        showPopup("success", response?.message);
        setImportEnable(false);
      }
    } catch (error) {
      const responseData = error.duplicates;

      setShowLoader(false);
      setErrorMessage(responseData.message);
      setIsErrorModalOpen(true);
      setImportEnable(false);
      setFilePath(null);
    } finally {
      setIsLoading(false);
    }

  };

  const columns = [
    // "srno",
    "product",
    "productSKU",
    "sno",
    "couponNumber",
    "points",
    "QRcodes",
    "startDate",
    "endDate",
    "startTime",
    "endTime",
    "status",
    "noOfCoupon",
    "createdAt",
    "updatedBy",
    "source",
    "couponAccessed",
  ];
  const headers = {
    // srno: "Sr. No",
    product: "Product Name",
    productSKU: "Product Sku",
    sno: "Serial No",
    couponNumber: "Code",
    points: "Reward Point",
    QRcodes: "QR Codes",
    startDate: "Start Date",
    endDate: "End Date",
    startTime: "Start Time",
    endTime: "End Time",
    status: "Status",
    noOfCoupon: "No Of Coupon",
    createdAt: "Created At",
    updatedBy: "Updated By Staff",
    source: "Source",
    couponAccessed: "Coupon Accessed",
  };

  const handleCheckboxChange = async (item) => {
    if (item == 'read') {
      showPopup('success', msg.readOnly)
    } else {
      const newStatus = item.status === "Active" ? "Inactive" : "Active";
      const updatedTableData = tableData.map((coupon) =>
        coupon.code === item.code
          ? { ...coupon, status: newStatus }
          : coupon
      );
      setTableData(updatedTableData);

      try {
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
              ? { ...coupon, status: item.status }
              : coupon
          );
          setTableData(revertedTableData);
        }
      } catch (error) {
        console.error("Error while making the API call:", error);
        // Revert the status if there is an error in the API call
        const revertedTableData = tableData.map((coupon) =>
          coupon.code === item.code
            ? { ...coupon, status: item.status }
            : coupon
        );
        setTableData(revertedTableData);
      }
    }
  };

  const handleDelete = async (id) => {
    if (id == 'read') {
      showPopup('success', msg.readOnly)
    } else {
      try {

        const response = await apiCall(
          `/coupon/deleteCoupon?id=${id}`,
          "DELETE",
          {}
        );

        if (response.status === 200) {
          fetchData();
          showPopup("error", "Coupon deleted successfully!");
        }
      } catch (error) {
        console.error('Error deleting module:', error?.response?.data?.message?.errors || error.message);
        showPopup('error', error?.response?.data?.message?.errors || error.message);
      }
    }

  };



  const duplicateColumns = [
    "serialNo",
    "code",
  ]

  const duplicateHeaders = {
    serialNo: "Serial No",
    code: "Code",
  }

  const data = {};
  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-2xl font-medium">Coupon List</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search By Product Name, Serial No, Code "
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

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsPopupOpen(true)}
          >
            Import
          </button>
          {searchTerm?<>
            <ExportDropdowns
            data={tableData.map((item, index) => ({
              ...item,
              srno: index + 1,
            }))}
            filename="Coupon_List"
            columns={columns}
            headers={headers}
          />
          </>:<>
          <ExportDropdown
              url='/points/CouponMigrationExport'
              status='Active'
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
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Product Name</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Product Sku</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Serial No</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Code</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Reward Point</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">QR Code</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Start Date</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">End Date</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap"> Status</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Created At</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Updated By Staff</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Source</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Coupon Accessed</th>
              <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Action</th>

            </tr>
          </thead>
          <tbody>
            {Array.isArray(tableData) && tableData?.length > 0 ? (
              transactions?.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 h-12">
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {index + 1}
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
                    {item.couponNumber}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.points}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setSelectedItem({
                          couponCode: item.sno,
                          code: item.couponNumber,
                          status: item.status === "Active",
                          startDate: item.startDate,
                          endDate: item.endDate,
                          rewardPoints: item.points,
                          qrcode: item.QRcode,
                          product: item.product,
                        });
                        setIsQrOpen(true);
                      }}
                    >
                      View
                    </button>
                  </td>

                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.startDate}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.endDate}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.status === "Active"}
                        onChange={() => handleCheckboxChange(item)}
                        className="form-checkbox text-blue-500"
                      />
                      <span className="mb-[2px]">
                        {item.status === "Active" ? "Active" : "Inactive"}
                      </span>

                    </div>
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.createdAt}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.updatedBy}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.source}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    {item.couponAccessed}
                  </td>
                  <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(item?.id)}
                      aria-label="Delete entry"
                    >
                      <i className="fas fa-trash"></i>
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="14"
                  className="text-center text-red-500 py-4"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {isQrOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-lg shadow-md w-[500px] p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {selectedItem.product || "Item Details"}
              </h2>

            </div>

            {/* Divider */}
            <hr className="my-3" />

            {/* Popup Content */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mt-2">
                <p className="mb-2">
                  <strong>Serial No:</strong> {selectedItem.couponCode}
                </p>
                <p className="mb-2">
                  <strong>Coupon No:</strong> {selectedItem.code}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  {selectedItem.status ? "Active" : "Inactive"}
                </p>
                <p className="mb-2">
                  <strong>Start Date:</strong> {selectedItem.startDate}
                </p>
                <p className="mb-2">
                  <strong>End Date:</strong> {selectedItem.endDate}
                </p>
                <p className="mb-2">
                  <strong>Reward Point:</strong>{" "}
                  {selectedItem.rewardPoints}
                </p>
              </div>
              <div className="flex justify-center items-center">
                <img
                  src={selectedItem.qrcode}
                  alt="QR Code"
                  className="w-36 h-36"
                />
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsQrOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
          <Toast />
        </div>
      )}
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

      {/* Popup for file import */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-lg shadow-md w-96 p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Import Coupon File</h2>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9l-6 6m6-6l6 6m-6-6l6-6M4 3l6 6"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-10">
              <label
                htmlFor="file-upload"
                className="block text-gray-700 font-medium mb-1"
              >
                Choose file <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg p-2">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full cursor-pointer"
                />
              </div>
              <div className="text-red-500">
                <p>{msg.note1}</p>
                <p>{msg.note3}</p>
                <p>{msg.note2}</p>

              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setIsPopupOpen(false)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
              <button
                onClick={fileScan}
                className={`px-4 py-2 rounded text-white ${isLoading || !selectedFile
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
                  }`}
                disabled={isLoading || (!selectedFile)} // Disable the button when loading
              >
                {isLoading ? "Scanning..." : "Scan"}
              </button>

            </div>
          </div>
        </div>
      )}

      {importEnable && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-lg shadow-md w-96 p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Import Coupon File</h2>
              <button
                onClick={() => setImportEnable(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9l-6 6m6-6l6 6m-6-6l6-6M4 3l6 6"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-10">
              <label
                htmlFor="file-upload"
                className="block text-gray-700 font-medium mb-1"
              >
                Now you can import File! <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setImportEnable(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
              <button
                onClick={handleImport}
                className={`px-4 py-2 rounded text-white ${isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
                  }`}
                disabled={isLoading} // Disable the button when loading
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>

            </div>
          </div>
        </div>
      )}


      {isErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-2/4 p-6">
            <h2 className="text-xl font-semibold text-red-500 mb-4">Duplicate Data Found...</h2>
            <p className="text-gray-700 mb-4">{errorMessage}</p>

            {/* Table for displaying duplicates */}
            <div className="overflow-y-scroll h-52">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Serial No</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {duplicates?.map((item, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{item?.serialNo}</td>
                      <td className="border border-gray-300 px-4 py-2">{item?.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between">
              <ExportDropdowns
                data={duplicates?.map((item, index) => ({
                  ...item,
                  srno: index + 1,
                }))}
                filename="Duplicate_Coupon_List"
                columns={duplicateColumns}
                headers={duplicateHeaders}
                
              />

              <button
                onClick={() => setIsErrorModalOpen(false)}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsList;
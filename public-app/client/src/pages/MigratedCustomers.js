import React, { useState, useEffect, useContext } from "react";
import "jspdf-autotable";
import { NavLink } from "react-router-dom";
import Filter from "../reusable/Filter";
import { apiCall } from "../api/Api";
import { showPopup } from '../reusable/Toast';
import Toast from '../reusable/Toast';
import LoaderSpiner from '../reusable/LoaderSpiner';
import { HeaderContext } from "../reusable/HeaderContext"
import { HTTP_METHODS, HTTP_RESPONSE } from "../reusable/constants";
import ExcelJS from "exceljs";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const MigratedCustomers = () => {
    const [flag, setFlag] = useState(true);
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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(50);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setCurrentPage(1);
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

    const handleSearch = async () => {
        try {
            setCurrentPage(1);
            const response = await apiCall(
                `/script/searchApiCustomer?search_value=${searchTerm}&store=rajnigandha`,
                HTTP_METHODS.GET
            );
            if (response.status === HTTP_RESPONSE.SUCCESS) {
                const data = response?.data;
                const customerList = data.map((item) => ({
                    id: item.id,
                    accountId: item.account_number,
                    firstName: item.first_name,
                    lastName: item.last_name,
                    customerId: item.customer_id,
                    mobileNo: item.phone_number,
                    alternateMobileNo: "",
                    email: item.email,
                    date_of_birth: formatDate(item.date_of_birth),
                    gender: item.gender,
                    maritial_status: item.maritial_status,
                    marriage_anniversary: formatDate(item.marriage_anniversary),
                    earned_point: item.earned_point !== null ? item.earned_point : "",
                    redeem_point: item.redeem_point,
                    expiry_point: item.expiry_point,
                    balance_point: item.balance_point,
                    State: item.State,
                    city: item.city,
                    country: item.country,
                    Distrtict: item.Distrtict,
                    pinCode: item.zip,
                    membershipTier: item.membership_tier,
                    addressLine1: item.address1,
                    addressLine2: item.address2,
                    notification: "",
                    membershipStatus: item.membership_status,
                    registrationTime: item.registration_time,
                    registrationDate: item.registration_date
                        ? (() => {
                            const date = new Date(item.registration_date);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                        })()
                        : "",
                }));
                setTotalPages(1);
                setTransactions(customerList);
            }
        } catch (error) {
            showPopup("error", error.message);
        }
    };

    useEffect(() => {
        if (flag) {
            setFlag(false);
            return;
        }
        const debounce = setTimeout(() => {
            if (!searchTerm.trim()) {
                fetchCustomerData();
            } else {
                handleSearch();
            }
        }, 500)
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handleUpdate = async () => {
        setLoadingg(true);

        if (!selectedCustomer) return;
        try {
            const payload = {
                first_name: selectedCustomer.firstName,
                last_name: selectedCustomer.lastName,
                phone_number: selectedCustomer.mobileNo,
                email: selectedCustomer.email,
                address1: selectedCustomer.addressLine1,
                address2: selectedCustomer.addressLine2,
                city: selectedCustomer.city,
                State: selectedCustomer.State,
                country: selectedCustomer.country,
                zip: selectedCustomer.pinCode,
            };
            const response = await apiCall(`/customer/customerUpdate?id=${selectedCustomer.id}&customer_id=${selectedCustomer.customerId}&store=${selectedValue}`, HTTP_METHODS.PUT, payload);
            if (response.status === HTTP_RESPONSE.SUCCESS) {
                setSelectedCustomer(null);
                fetchCustomerData();
                showPopup("success", "Customer Updated Successfully");
            }
            setLoadingg(false);
        } catch (error) {
            showPopup("error", "Failed to update customer details.");
            console.error("Error updating customer details:", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";

        if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
            return dateString.replace(/-/g, '/');
        }

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
            return dateString;
        }

        if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        return "";
    };


    const [totalCustomers, setTotalCustomers] = useState(0);

    const fetchCustomerData = async () => {
        setShowLoader(true)
        try {
            const url = `/script/customerName?store=${selectedValue}&page=${currentPage}&limit=${pageSize}`;
            const response = await apiCall(url, HTTP_METHODS.GET);

            if (response.status === HTTP_RESPONSE.SUCCESS) {
                const data = response.data;
                setTotalPages(response?.totalPages);
                setTotalCustomers(response?.totalRecords);
                setShowLoader(false)
                const customerList = data.map((item) => ({
                    id: item.id,
                    accountId: item.account_number,
                    firstName: item.first_name,
                    lastName: item.last_name,
                    customerId: item.customer_id,
                    mobileNo: item.phone_number,
                    alternateMobileNo: "",
                    email: item.email,
                    date_of_birth: formatDate(item.date_of_birth),
                    gender: item.gender,
                    maritial_status: item.maritial_status,
                    marriage_anniversary: formatDate(item.marriage_anniversary),
                    earned_point: item.earned_point,
                    redeem_point: item.redeem_point,
                    expiry_point: item.expiry_point,
                    balance_point: item.balance_point,
                    State: item.State,
                    city: item.city,
                    country: item.country,
                    Distrtict: item.Distrtict,
                    pinCode: item.zip,
                    membershipTier: item.membership_tier,
                    addressLine1: item.address1,
                    addressLine2: item.address2,
                    notification: "",
                    membershipStatus: item.membership_status,
                    registrationDate: item.registration_date
                        ? (() => {
                            const date = new Date(item.registration_date);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                        })()
                        : "",
                    registrationTime: item.registration_time,
                }));
                setTransactions(customerList);
            }
        } catch (error) {
            showPopup("error", error.message);
            if (error.message == "No transactions found") {
                setTransactions([]);
            }
            setShowLoader(false)
        }
    };


    useEffect(() => {
        fetchCustomerData();
    }, [selectedValue, currentPage, pageSize]);

    const filterApi = async (payload) => {
        const { endDate, startDate } = payload;
        return apiCall(`/script/customerName?start_date=${startDate}&end_date=${endDate}&store=${selectedValue}`);
    };

    const handleFilterApply = (data) => {
        if (data === 'No transactions found' || data.length === 0) {
            setTransactions([]);
            return;
        }
        const customerList = data.map((item) => ({
            id: item.id,
            accountId: item.account_number,
            firstName: item.first_name,
            lastName: item.last_name,
            customerId: item.customer_id,
            mobileNo: item.phone_number,
            alternateMobileNo: "",
            email: item.email,
            date_of_birth: formatDate(item.date_of_birth),
            gender: item.gender,
            maritial_status: item.maritial_status,
            marriage_anniversary: formatDate(item.marriage_anniversary),
            earned_point: item.earned_point,
            redeem_point: item.redeem_point,
            expiry_point: item.expiry_point,
            balance_point: item.balance_point,
            State: item.State,
            city: item.city,
            country: item.country,
            Distrtict: item.Distrtict,
            pinCode: item.zip,
            membershipTier: item.membership_tier,
            addressLine1: item.address1,
            addressLine2: item.address2,
            notification: "",
            membershipStatus: item.membership_status,
            registrationDate: item.registration_date
                ? (() => {
                    const date = new Date(item.registration_date);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                })()
                : "",
            registrationTime: item.registration_time,
        }));
        setTotalPages(1);
        setTransactions(customerList);
    };

    const ExportPopup = ({ onClose }) => {
        return (
            <>
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80">
                        <h2 className="text-lg font-medium mb-4">Export Customers</h2>
                        <h2 className="text-sm mb-4">
                            This export may take approximately
                            15-20 minutes. We appreciate your patience and understanding.
                        </h2>
                        <div className="flex gap-3">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                onClick={handleMultipleExport}
                            >
                                Export
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const [showExportPopup, setShowExportPopup] = useState(false);

    const headers = {
        account_number: "Account Number",
        first_name: "First Name",
        last_name: "Last Name",
        phone_number: "Mobile No",
        email: "Email",
        date_of_birth: "Date Of Birth",
        gender: "Gender",
        maritial_status: "Maritial Status",
        marriage_anniversary: "Marriage Anniversary",
        earned_point: "Earn Points",
        redeem_point: "Redeem Points",
        expiry_point: "Expired Points",
        balance_point: "Balance Points",
        State: "State",
        city: "City",
        Distrtict: "District",
        zip: "Pin Code",
        membership_tier: "Membership Tier",
        address1: "Address Line 1",
        address2: "Address Line 2",
        notification: "Notification",
        membership_status: "Membership Status",
        registration_date: "Registration Date",
        registration_time: "Registration Time",
    };
    const columns = [
        "account_number",
        "first_name",
        "last_name",
        "phone_number",
        "email",
        "date_of_birth",
        "gender",
        "maritial_status",
        "marriage_anniversary",
        "earned_point",
        "redeem_point",
        "expiry_point",
        "balance_point",
        "State",
        "city",
        "Distrtict",
        "zip",
        "membership_tier",
        "address1",
        "address2",
        "notification",
        "membership_status",
        "registration_date",
        "registration_time",
    ];

    const formatExcel = (date) => {
        if (date instanceof Date) {
            const day = ("0" + date.getDate()).slice(-2);
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } else if (typeof date === 'string') {
            if (/^\d{4}-\d{2}-\d{2}/.test(date)) { // yyyy-mm-dd
                const parsedDate = new Date(date);
                if (!isNaN(parsedDate)) {
                    const day = ("0" + parsedDate.getDate()).slice(-2);
                    const month = ("0" + (parsedDate.getMonth() + 1)).slice(-2);
                    const year = parsedDate.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            } else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) { // dd-mm-yyyy
                const [day, month, year] = date.split('-');
                if (!isNaN(new Date(`${year}-${month}-${day}`))) {
                    return `${day}/${month}/${year}`;
                }
            }
        }

        return date;
    };


    const exportDropdown = (data, filename, columns, headers) => {
        const exportToExcel = () => {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Sheet1");

            worksheet.columns = [{ header: "Sr. No", width: 10 }, ...Object.values(headers).map((header) => ({
                header,
                width: 15,
            }))];

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
                cell.alignment = { horizontal: "center" };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF42ACED" },
                };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });

            

            data.forEach((item, index) => {
                const row = [index + 1, ...columns.map((col) => formatExcel(item[col]))];
                const newRow = worksheet.addRow(row);

                newRow.eachCell((cell) => {
                    cell.alignment = { horizontal: "center" };
                });
            });

            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: "application/octet-stream" });
                saveAs(blob, `${filename}.xlsx`);
            });
        };


        exportToExcel();
    };

    // const handleMultipleExport = async () => {
    //     setShowLoader(true);
    //     let allData = [];
    //     let page = 1;
    //     let totalRecords = 0;
    //     let fetchedRecords = 0;
    //     let again = 0;

    //     try {
    //         do {
    //             const data = {
    //                 again: `${again}`,
    //                 page_no: `${page}`
    //             };

    //             

    //             const response = await apiCall('/points/customerMigrationExport', HTTP_METHODS.POST, data);

    //             if (response?.status) {
    //                 
    //                 allData = [...allData, ...response.data];

    //                 fetchedRecords += response.data.length;

    //                 if (!totalRecords) {
    //                     totalRecords = response?.total;
    //                 }

    //                 

    //                 
    //                 if (again === 0) {
    //                     again = 1;
    //                     page = 1
    //                 }
    //                 else page++;

    //             } else {
    //                 
    //                 break;
    //             }
    //         } while (fetchedRecords < totalRecords);
    //         
    //         if (allData.length > 0) {
    //             
    //             
    //             const fileName = "Migrated_Customers";
    //             exportDropdown(allData, fileName, columns, headers);
    //         } else {
    //             console.warn("No data available for export");
    //         }
    //     } catch (error) {
    //         console.error("Error exporting data:", error);
    //     }
    //     finally {
    //         setShowLoader(false);
    //     }
    // };


    const handleMultipleExport = async () => {
        setShowLoader(true);
        let allData = [];
        let page = 1;
        let totalRecords = 0;
        let fetchedRecords = 0;
        let again = 0;
        let fileCounter = 1; 
    
        try {
            do {
                const data = { again: `${again}`, page_no: `${page}` };
    
                
                const response = await apiCall('/points/customerMigrationExport', HTTP_METHODS.POST, data);
    
                if (response?.status) {
                    
                    allData = [...allData, ...response.data];
                    fetchedRecords += response.data.length;
    
                    if (!totalRecords) {
                        totalRecords = response?.total;
                    }
    
                    
                    
    
                    if (again === 0) {
                        again = 1;
                        page = 1;
                    } else {
                        page++;
                    }
    
                    while (allData.length >= 100000) {
                        const fileName = `Migrated_Customers_Part${fileCounter}`;
                        exportDropdown(allData.slice(0, 100000), fileName, columns, headers);
                        allData = allData.slice(100000); 
                        fileCounter++; 
                    }
    
                } else {
                    
                    break;
                }
            } while (fetchedRecords < totalRecords);
    
            if (allData.length > 0) {
                const fileName = `Migrated_Customers_Part${fileCounter}`;
                exportDropdown(allData, fileName, columns, headers);
                setShowExportPopup(false);
            }
    
        } catch (error) {
            console.error("Error exporting data:", error);
        } finally {
            setShowLoader(false);
        }
    };
    
    return (
        <div className="w-full mx-auto p-8 shadow-md">
            {showLoader && <LoaderSpiner text="Loading ..." />}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h1 className="text-2xl font-medium whitespace-nowrap">Migrated Customer</h1>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search By Account No, Mobile No"
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
                        clear={fetchCustomerData}
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => setShowFilterPopup(true)}
                    >Filter </button>

                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        onClick={() => setShowExportPopup(true)}
                    >
                        Export
                    </button>

                    {showExportPopup && (
                        <ExportPopup
                            onClose={() => setShowExportPopup(false)}
                        />
                    )}
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
                                Email
                            </th>
                            <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                                Date Of Birth
                            </th>
                            <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                                Gender
                            </th>
                            <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                                Marital Status
                            </th>
                            <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">
                                Marriage Anniversary Date
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
                        {transactions.length === 0 ? (<tr>
                            <td colSpan="12" className="text-center text-red-500 py-4">
                                No data available
                            </td>
                        </tr>) : (
                            transactions?.map((transaction) => (
                                <tr
                                    key={transaction?.id}
                                    className="border-b hover:bg-gray-50 h-12"
                                >
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                                        {transaction?.id}
                                    </td>
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                                        {transaction?.accountId}
                                    </td>
                                    <td
                                        className="px-2 border-r text-sm font-medium whitespace-nowrap text-left cursor-pointer text-blue-500 hover:underline"
                                        onClick={() => handleEditCustomer(transaction)}
                                    >
                                        {transaction?.firstName}
                                    </td>
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                                        {transaction?.lastName}
                                    </td>
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                                        {transaction?.mobileNo}
                                    </td>
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                                        {transaction?.email}
                                    </td>
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                                        {transaction?.date_of_birth}
                                    </td>
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                                        {transaction?.gender}
                                    </td>
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                                        {transaction?.maritial_status}
                                    </td>
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-left">
                                        {transaction?.marriage_anniversary}
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
                                            {transaction?.addressLine1?.length > 25
                                                ? `${transaction?.addressLine1.slice(0, 25)}.....`
                                                : transaction?.addressLine1}
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
                                    <td className="px-2 border-r text-sm font-medium whitespace-nowrap flex justify-center">
                                        <NavLink
                                            to={`/migrated-seller-details/${transaction?.id}`}
                                            state={{
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
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between">
                <div className="mt-4">
                    <h1>Total Customers : {totalCustomers}</h1>
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
                                    value={selectedCustomer?.firstName}
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
                                    value={selectedCustomer?.lastName || ""}
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
                                    value={selectedCustomer?.mobileNo || ""}
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
                                    value={selectedCustomer?.addressLine2 || ""}
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
                                    value={selectedCustomer?.State || ""}
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
                                    value={selectedCustomer?.country || ""}
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
}

export default MigratedCustomers;

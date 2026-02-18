import React, { useContext, useEffect, useState } from "react";
import { apiCall } from "../api/Api";
import LoaderSpiner from "../reusable/LoaderSpiner";
import { showPopup } from "../reusable/Toast";
import ExportDropdown from "../reusable/Export_to_excel";
import { HeaderContext } from "../reusable/HeaderContext";
import msg from "../reusable/msg.json"

const PinList = () => {
    const { selectedValue } = useContext(HeaderContext);

    const [pins, setPins] = useState([]);
    const [pinList, setPinList] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [selectedState, setSelectedState] = useState('');
    const [isInitialRender, setIsInitialRender] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentList = pins.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(pins.length / itemsPerPage);


    // Pagination functions
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };


    const handleGetPins = async () => {
        setShowLoader(true)
        try {
            const response = await apiCall('/pincode/getPincode', "GET");

            if (response.status === 200) {
                setPins(response.data);
                setShowLoader(false);
            }
            else {
                setShowLoader(false);
            }
        }
        catch (error) {
            showPopup('error', error.message)
            setShowLoader(false);
        }
    }

    const handlePinList = async () => {
        setShowLoader(true);

        try {
            const response = await apiCall(`/pincode/getStateNames?store=${selectedValue}`, "GET");
            if (response.status === 200) {
                setShowLoader(false);
                setPinList(response.data);
            }
        }
        catch (error) {
            showPopup('error', error.message);
            setShowLoader(false);
        }
    }

    useEffect(() => {
        handleGetPins();
        handlePinList();
    }, []);

    const handleImport = async () => {
        setShowLoader(true);

        if (uploadFile) {
            try {
                const formData = new FormData();
                formData.append('pin', uploadFile);

                

                const headers = {
                    'Content-Type': 'multipart/form-data'
                }

                const response = await apiCall('/pincode/importpincodes', 'POST', formData, headers);

                if (response.status === 200) {
                    await handleGetPins();
                    setIsPopupOpen(false);
                    showPopup('success', 'File Uploaded Successfully');
                    setShowLoader(false);
                }

            }
            catch (error) {
                showPopup('error', error.message);
                setShowLoader(false);
            }
        }
        else {
            showPopup('warning', 'Please select a file')
            setShowLoader(false);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedExtensions = /(\.xls|\.xlsx)$/i;

        if (file) {
            if (!allowedExtensions.test(file.name)) {
                showPopup("warning", "Please upload a valid Excel file (.xls or .xlsx).");
                e.target.value = "";
                setUploadFile(null);
            } else {
                setUploadFile(file);
            }
        }
    }

    const toggleRowSelection = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    const toggleStatus = (id) => {
        setPins((prev) =>
            prev.map((pin) =>
                pin.id === id ? { ...pin, status: pin.status === "Active" ? "In-Active" : "Active" } : pin
            )
        );
    };

    const handleSearch = async () => {
        try {
            const response = await apiCall(`/pincode/searchPins?search=${searchTerm}`, 'GET');

            if (response.status === 200) {
                setPins(response.data);
            }
        }
        catch (error) {
            showPopup('error', error.message)
        }
    }

    useEffect(() => {
        if (isInitialRender) {
            setIsInitialRender(false);
            return;
        }

        const debounceSearch = setTimeout(() => {
            if (searchTerm === '') {
                handleGetPins();
            } else {
                handleSearch();
            }
        }, 1500);

        return () => clearTimeout(debounceSearch);
    }, [searchTerm])

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
    }

    const handleFilterState = async () => {
        if (selectedState) {
            setShowLoader(true);
            try {
                const response = await apiCall(`/pincode/filterState?state=${selectedState}`, 'GET');
                if (response.status === 200) {
                    setPins(response.data);
                    setSelectedState('')
                    setShowLoader(false)
                }
                else {
                    setShowLoader(false)
                }
            }
            catch (error) {
                showPopup('error', error.message);
                setShowLoader(false)
            }
        }
    }

    useEffect(() => {
        handleFilterState()
    }, [selectedState])

    const columns = [
        "pin_code",
        "stateName",
        "district",
        "status",
        "courierPartner",
        "createdAt",
    ]

    return (
        <div className="w-full mx-auto p-8 shadow-md">
            {showLoader && <LoaderSpiner text="Loading ..." />}
            <h1 className="text-2xl font-bold mb-4">Pin List</h1>
            <div className="flex items-center justify-between mb-4">
                <div className="flex w-3/5">
                    <select className="border rounded px-4 py-2 mr-2 w-auto"
                        value={selectedState}
                        onChange={handleStateChange}>
                        <option> All </option>
                        {
                            pinList.map((pin, index) => (
                                <option key={index} value={pin.stateName} className="w-auto">{pin.stateName}</option>
                            ))
                        }
                    </select>
                    <input
                        type="text"
                        placeholder="Search By Pincode/District/State"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border w-full rounded px-4 py-2 flex-1"
                    />
                </div>
                <div className="flex gap-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                        onClick={() => setIsPopupOpen(true)}
                    >Import</button>
                    <ExportDropdown
                        data={pins}
                        filename="pin_List"
                        columns={columns}
                    />
                </div>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="text-left bg-gray-100 whitespace-nowrap">
                        <th className="border border-gray-300 px-4 py-2">
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    setSelectedIds(e.target.checked ? pins.map((pin) => pin.id) : [])
                                }
                                checked={selectedIds.length === pins.length}
                            />
                        </th>
                        <th className="border border-gray-300 px-4 py-2">Sr. No</th>
                        <th className="border border-gray-300 px-4 py-2">Pin Code</th>
                        <th className="border border-gray-300 px-4 py-2">State name</th>
                        <th className="border border-gray-300 px-4 py-2">District Name</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Delivery/Courier</th>
                        <th className="border border-gray-300 px-4 py-2">Create date</th>
                    </tr>
                </thead>
                <tbody>
                    {currentList.length > 0 ? (currentList.map((pin, index) => (
                        <tr key={pin.id} className="text-left odd:bg-white even:bg-gray-50  whitespace-nowrap hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(pin.id)}
                                    onChange={() => toggleRowSelection(pin.id)}
                                />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{indexOfFirst + index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{pin.pin_code}</td>
                            <td className="border border-gray-300 px-4 py-2">{pin.stateName}</td>
                            <td className="border border-gray-300 px-4 py-2">{pin.district}</td>
                            <td
                                className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
                                onClick={() => toggleStatus(pin.id)}
                            >
                                <input type="checkbox" checked={pin.status === "active"} readOnly />
                                <span className="ml-2">{pin.status}</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{pin.courierPartner}</td>
                            <td className="border border-gray-300 px-4 py-2">{pin?.createdAt
                                ? new Date(pin?.createdAt)
                                    .toISOString()
                                    .split("T")[0]
                                    .split("-")
                                    .reverse()
                                    .join("-")
                                : "N/A"}</td>
                        </tr>
                    )))
                        :
                        (
                            <tr>
                                <td colSpan="8" className="p-2 text-center text-red-500">
                                    No data available.
                                </td>
                            </tr>
                        )

                    }
                </tbody>
            </table>

            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white rounded-lg shadow-md w-[500px] p-6 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Import Pin File</h2>
                            <button onClick={() => setIsPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9l-6 6m6-6l6 6m-6-6l6-6M4 3l6 6" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-10">
                            <label htmlFor="file-upload" className="block text-gray-700 font-medium mb-1">
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
                        </div>

                        <div className="text-red-500">
                            <p>{msg.note1}</p>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleImport}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

export default PinList;


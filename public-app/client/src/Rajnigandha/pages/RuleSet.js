/* eslint-disable no-unused-vars */


import React, { useState, useEffect } from "react";
import CustomModal from "../../reusable/CustomModal";
import { apiCall } from "../../api/Api";
import Toast from "../../reusable/Toast";
import { showToast } from "../../reusable/Toast";

function RuleSet() {
    const [open, setOpen] = useState(false);
    const [fetchShopifyProducts, setfetchShopifyProducts] = useState();
    const [pointsListNew, setPointsListNew] = useState();
    const [editId, setEditId] = useState(null);
    
    const handleOpen = () => setOpen(true);
    const [isEditing, setIsEditing] = useState(false);

    // const handleOpenRegistration = () => setOpenRegistration(true)

    // const [remarks, setRemarks] = useState("");

    const [formData, setFormData] = useState({
        // ruleType: "online_purchase",
        purchaseValue: "",
        points: "",
        remarks: "",
        expiresAfter: "",
        expiresType: "",
        expiresOn: "",
        creditAfter: "",
        creditType: "",
    });


    const handleClose = () => {
        setOpen(false);
        setIsEditing(false);
        setFormData({
            // ruleType: "online_purchase",
            purchaseValue: "",
            points: "",
            remarks: "",
            expiresOn: "",
        }); // Reset form data
    };



    const handleDelete = async (id) => {
        const data = {
            id: id,
            type: "point_conversion_online_purchase",
        }
        try {
            const response = await apiCall("/points/deleteValue", "delete", data);
            if (response.status === 200) {
                getAllpointslist()
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }

    };



    const getAllfetchShopifyProducts = async () => {
        try {
            const response = await apiCall("/points/fetchShopifyProducts", "GET");
            if (response.status === 200) {
                setfetchShopifyProducts(response?.data?.products);
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
    };

    const getAllCategory = async () => {
        try {
            const response = await apiCall("/points/fetchCategories", "GET");
            if (response.status === 200) {
                // 
                // setfetchCategory(response?.data?.collections);
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
    };
    // 
    const getAllpointslist = async () => {
        try {
            const response = await apiCall("/points/getAll", "GET");
            if (response.status === 200) {
                setPointsListNew(response?.data[0]);
                // 
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
    };


    useEffect(() => {
        getAllfetchShopifyProducts();
        getAllpointslist();
        getAllCategory();
        // getAllpointsSKUlist('sku_specific');
    }, []);

    const editById = (id) => {

        const selectedRow = pointsListNew?.point_conversion_online_purchase?.value.find(row => row.value_id === id);

        if (selectedRow) {
            setFormData({
                purchaseValue: selectedRow.purchaseValue,
                points: selectedRow.points,
                expiresAfter: selectedRow.expiresAfter,
                expiresType: selectedRow.expiresType,
                remarks: selectedRow.remarks,
                creditAfter: selectedRow.creditAfter,
                creditType: selectedRow.creditType,
            });
            setIsEditing(true);
            setEditId(id); // Store the ID of the item being edited
            setOpen(true); // Open the modal
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };






    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataCreat = {
            id: 1,
            type: "point_conversion_online_purchase",
            newValue: {
                ...formData,
                expiresOn: `${formData.expiresAfter} ${formData.expiresType}`,
                credit_after_days: `${formData.creditAfter}`

            }
        };

        const formDataUpdate = {
            id: 1,
            type: "point_conversion_online_purchase",
            newValue: {
                value_id: editId,
                ...formData,
                expiresOn: `${formData.expiresAfter} ${formData.expiresType}`,
                credit_after_days: `${formData.creditAfter} ${formData.creditType}`,

            }
        };
        try {
            if (isEditing) {
                // Update existing entry
                const response = await apiCall('/points/updateValue', "post", formDataUpdate
                );
                if (response.status === 200) {
                    setOpen(false);
                    getAllpointslist()
                    // getAllpointsOnLinelist("online_purchase");
                    showToast("Updated successfully!", "success");
                }
            } else {
                // Create new entry
                const response = await apiCall("/points/addValue", "POST", formDataCreat);
                if (response.status === 200) {
                    setOpen(false);
                    getAllpointslist()
                    // getAllpointsOnLinelist("online_purchase");
                    showToast("Created successfully!", "success");
                }
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
    };
    const handleToggle = async (ruleKey, checked) => {
        // setIsActive('')
        // Update the specific rule's status in pointsListNew
        const updatedData = {
            ...pointsListNew,
            [ruleKey]: {
                ...pointsListNew[ruleKey],
                status: checked ? "active" : "inactive"
            }
        };

        setPointsListNew(updatedData); // Update local state

        try {
            const response = await apiCall(
                '/points/addOrUpdateRuleSet',
                "post",
                updatedData
            );
            if (response.status === 200) {
                showToast(`${checked ? "active" : "inactive"} successfully!`, "success");
                getAllpointslist();
            }
        } catch (error) {
            console.error("Error calling API:", error);
        }
    };


    const formContent = (
        <div className="flex justify-center items-center ">
            <div className="rounded-lg p-6 w-96">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Purchase Value:
                        </label>
                        <input
                            type="text"
                            name="purchaseValue"
                            value={formData?.purchaseValue}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter purchase value"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points:
                        </label>
                        <input
                            type="text"
                            name="points"
                            value={formData?.points}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter points awarded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points Expiry:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="expiresAfter"
                                value={formData?.expiresAfter}
                                onChange={handleChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                            />
                            <select
                                name="expiresType"
                                value={formData?.expiresType}
                                onChange={handleChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                <option value="days">Days</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks:
                        </label>
                        <input
                            type="text"
                            name="remarks"
                            value={formData?.remarks}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter remarks"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Credit After:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="creditAfter"
                                value={formData?.creditAfter}
                                onChange={handleChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                            />
                            <select
                                name="creditType"
                                value={formData?.creditType}
                                onChange={handleChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                <option value="days">Days</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                    </div>
                    {isEditing == true ? (
                        <>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                update
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Submit
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );


    return (
        <div>
            <CustomModal
                open={open}
                handleClose={handleClose}
                description={formContent}
            />


            {/* On-Line Purchase Section */}
            <div className="max-w-6xl mx-auto p-8 shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 w-full">
                        <h1 className="text-lg font-bold">
                            Points Conversion - On-Line Purchase
                        </h1>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="switch1"
                                checked={pointsListNew?.point_conversion_online_purchase?.status === "active"}
                                className="sr-only peer"
                                onChange={(e) =>
                                    handleToggle("point_conversion_online_purchase", e.target.checked)
                                }
                            />
                            <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                            <div
                                className={`absolute left-0 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${pointsListNew?.point_conversion_online_purchase?.status === "active" ? "translate-x-4" : "translate-x-0"
                                    }`}
                            ></div>
                        </label>
                    </div>

                    <button
                        className={`px-4 py-2 rounded-md ml-2 ${pointsListNew?.point_conversion_online_purchase?.value && Object.keys(pointsListNew.point_conversion_online_purchase.value).length > 0
                            ? "bg-gray-400 text-white-500 cursor-not-allowed"
                            : "bg-[#178eba] text-white"
                            }`}
                        onClick={handleOpen}
                        disabled={pointsListNew?.point_conversion_online_purchase?.value && Object.keys(pointsListNew.point_conversion_online_purchase.value).length > 0}
                    >
                        Add
                    </button>
                </div>
                <div className="max-h-[278px] min-h-auto overflow-y-auto">
                    {pointsListNew?.point_conversion_online_purchase?.status == "active" ? <>
                        <table className="w-full border-collapse border border-gray-300 mt-4">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    {/* <th className="p-2 border border-gray-300">Statue</th> */}
                                    <th className="p-2 border border-gray-300">Purchase Value</th>
                                    <th className="p-2 border border-gray-300">Points </th>
                                    <th className="p-2 border border-gray-300">Point Expiry </th>
                                    <th className="p-2 border border-gray-300">Credit After Duration</th>
                                    <th className="p-2 border border-gray-300">Remarks </th>
                                    <th className="p-2 border border-gray-300">Created By</th>
                                    <th className="p-2 border border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2 border border-gray-300">
                                        {pointsListNew?.point_conversion_online_purchase?.value[0]?.purchaseValue ?? "N/A"}
                                    </td>
                                    <td className="p-2 border border-gray-300">
                                        {pointsListNew?.point_conversion_online_purchase?.value[0]?.points ?? "N/A"}
                                    </td>
                                    <td className="p-2 border border-gray-300">
                                        {pointsListNew?.point_conversion_online_purchase?.value[0]?.expiresAfter ?? "N/A"}&nbsp;{pointsListNew?.point_conversion_online_purchase?.value[0]?.expiresType}
                                    </td>
                                    <td className="p-2 border border-gray-300">
                                        {pointsListNew?.point_conversion_online_purchase?.value[0]?.creditAfter ?? "N/A"} &nbsp;{pointsListNew?.point_conversion_online_purchase?.value[0]?.creditType}
                                        {/* {row?.creditAfter}/{row?.expiresOn} */}
                                    </td>
                                    <td className="p-2 border border-gray-300">
                                        {pointsListNew?.point_conversion_online_purchase?.value[0]?.remarks ?? "N/A"}
                                    </td>
                                    <td className="p-2 border border-gray-300">
                                        {pointsListNew?.point_conversion_online_purchase?.value[0]?.created_by ?? "Super Admin"}
                                    </td>
                                    <td className="p-2 border border-gray-300">
                                        <button
                                            className="mr-4 text-[#178eba]"
                                            onClick={() => editById(pointsListNew?.point_conversion_online_purchase?.value[0]?.value_id)}
                                        >
                                            <i className="fas fa-pen"></i>
                                        </button>
                                        <button
                                            className="text-red-500"
                                            onClick={() => handleDelete(pointsListNew?.point_conversion_online_purchase?.value[0]?.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </> : <></>}
                </div>
            </div>

            <Toast />
        </div>
    );
}

export default RuleSet;

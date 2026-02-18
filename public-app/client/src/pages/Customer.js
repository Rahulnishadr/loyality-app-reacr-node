import React, { useState } from 'react';

const Customer = () => {
    const initialPoints = [
        { id: 1, duration: "30 Days", createdBy: "Admin", remarks: "Monthly expiry" },
    ];
    const [purchaseRows, setPurchaseRows] = useState(initialPoints);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [inputNumber, setInputNumber] = useState('');
    const [selectValue, setSelectValue] = useState('');

    const handleDelete = (index) => {
        setPurchaseRows(purchaseRows.filter((_, i) => i !== index));
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
        setEditingIndex(null); // Set to null to indicate a new entry
    };

    const handleEditClick = (index) => {
        setIsModalOpen(true);
        setEditingIndex(index);
        setInputNumber(purchaseRows[index].duration.split(' ')[0]);
        setSelectValue(purchaseRows[index].remarks);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setInputNumber('');
        setSelectValue('');
        setEditingIndex(null);
    };

    const handleSaveClick = () => {
        if (!inputNumber || !selectValue) {
            alert("Please fill in all fields");
            return;
        }

        const newEntry = {
            id: editingIndex !== null ? purchaseRows[editingIndex].id : purchaseRows.length + 1,
            duration: `${inputNumber} ${selectValue}`,
            createdBy: editingIndex !== null ? purchaseRows[editingIndex].createdBy : "User",
            remarks: selectValue,
        };

        if (editingIndex !== null) {
            const updatedRows = [...purchaseRows];
            updatedRows[editingIndex] = newEntry;
            setPurchaseRows(updatedRows);
        } else {
            setPurchaseRows([...purchaseRows, newEntry]);
        }

        handleModalClose();
    };

    return (
        <div className="w-full mx-auto p-8 shadow-md h-screen">
            <div className="w-full flex items-center mb-6 border-b pb-3">
                <h1 className="text-2xl font-semibold">Expiry Reminder</h1>
                <button
                    onClick={handleAddClick}
                    aria-label="Add entry"
                    className="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Add
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2 border border-gray-300 font-medium">S. No</th>
                        <th className="p-2 border border-gray-300 font-medium">Duration</th>
                        <th className="p-2 border border-gray-300 font-medium">Created By</th>
                        <th className="p-2 border border-gray-300 font-medium">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseRows.length > 0 ? (
                        purchaseRows.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-100 text-left">
                                <td className="p-2 border border-gray-300 ">{index + 1}</td>
                                <td className="p-2 border border-gray-300 ">{row.duration}</td>
                                <td className="p-2 border border-gray-300 ">{row.createdBy}</td>
                                <td className="p-2 border border-gray-300 ">
                                    <button
                                        className="mr-4 text-[#178eba]"
                                        onClick={() => handleEditClick(index)}
                                        aria-label="Edit entry"
                                    >
                                        <i className="fas fa-pen"></i>
                                    </button>
                                    <button
                                        className="text-red-500"
                                        onClick={() => handleDelete(index)}
                                        aria-label="Delete entry"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-2 text-center text-gray-500">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-end mt-4">
                <button className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2">
                    Save
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-1/2 pr-2">
                                <input
                                    type="number"
                                    placeholder="Input number"
                                    value={inputNumber}
                                    onChange={(e) => setInputNumber(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div className="w-1/2 pl-2">
                                <select
                                    value={selectValue}
                                    onChange={(e) => setSelectValue(e.target.value)}
                                    className="w-full px-4 py-2 border rounded">
                                    <option value="">Select</option>
                                    <option value="Month">Month</option>
                                    <option value="Week">Week</option>
                                    <option value="Days">Days</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-x-4">
                            <button onClick={handleModalClose} className="text-red-500 hover:underline">
                                Close
                            </button>
                            <button
                                onClick={handleSaveClick}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                {editingIndex !== null ? "Save Changes" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customer;

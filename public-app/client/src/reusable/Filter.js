import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import LoaderSpiner from "./LoaderSpiner";

const Filter = ({ isVisible, onClose, filterApi, onFilterApply, filterConfig = [],formState,setFormState }) => {
  // const [formState, setFormState] = useState({});
  const [showLoader, setShowLoader] = useState(false);

  
  
  const handleFieldChange = (field, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleApplyFilter = async () => {
    setShowLoader(true);
    
    const { startDate, endDate, status, brandName } = formState;

    if (!startDate || !endDate || !status || !brandName) {
      console.error("Start date and end date are required.");
      // return;
    }


    try {
      const response = await filterApi(formState);

      if (response?.status === 200) {
        setShowLoader(false)
        onFilterApply(response);
      }
      else {
        onFilterApply(response);
        setShowLoader(false)
      }
    } catch (error) {

      if (error?.status === 404 || error?.status === 'error') {
        onFilterApply(error?.data || error?.message);
      }
    }

    setShowLoader(false)
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter</h2>
          <button className="text-red-500 text-xl" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          {filterConfig.map(({ field, label, type, options }) => (
            <div key={field} className="flex-1 min-w-[200px]">
              <label className="block mb-1">{label}</label>
              {type === "date" && (
                <input
                  type="date"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={formState[field] || ""}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                />
              )}
              {type === "select" && (
                <select
                  className="border border-gray-300 rounded p-2 w-full"
                  value={formState[field] || ""}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                >
                  <option value="">Select {label}</option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          {/* <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {setFormState({}); clear(); onClose();}}
          >
            Clear
          </button> */}
          <button
            className={`px-4 py-2 rounded ${!formState.startDate && !formState.endDate && !formState.status && !formState.brandName
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            onClick={handleApplyFilter}
            disabled={!formState.startDate && !formState.endDate && !formState.status && !formState.brandName}
          >
            Apply Filter
          </button>

        </div>
      </div>
    </div>
  );
};

export default Filter;

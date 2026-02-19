import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import { apiCall } from "../api/Api";
import LoaderSpiner from "../reusable/LoaderSpiner";
import { showPopup } from "../reusable/Toast";
import Toast from '../reusable/Toast';
import msg from "../reusable/msg.json"

function CampaignList() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPopupStatusChange, setShowPopupStatusChange] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newDes, setNewDes] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [welcome, setWelcome] = useState("");
  const [blue, setBlue] = useState("");
  const [silver, setSilver] = useState("");
  const [gold, setGold] = useState("");
  const [platinum, setPlatinum] = useState("");
  const [status, setStatus] = useState("");
  const [pointType, setPointType] = useState("");
  const [productName, setProductName] = useState("");
  
  // eslint-disable-next-line no-unused-vars
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [productWeightage, setProductWeightage] = useState([]);

  const [productToDelete, setProductToDelete] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleDeleteClick = (id) => {
    if(id=='read'){
      showPopup('warning', msg.readOnly)
    }else{

      setProductToDelete(id);
      setIsPopupVisible(true);
    }
  };
  const handleCancelDelete = () => {
    setIsPopupVisible(false);
    setProductToDelete(null);
  };

  const fetchCampaigns = async (page = 1) => {
    setShowLoader(true);
    try {
      const data = {};
      const response = await apiCall(
        `/campaign/list_new?page=${page}`,
        "GET",
        data
      );
      if (response.status === 200) {
        setShowLoader(false);
        setCampaigns(response.data);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      if (error?.status === 404) {
        setShowLoader(false);
        setCampaigns([]);
        setTotalPages(0);
      }
      setShowLoader(false);
      showPopup("error", error.message);
    }
  };

  useEffect(() => {
    fetchCampaigns(currentPage);

    const fetchShopifyProducts = async () => {
      try {
        const response = await apiCall(
          "/points/fetchShopifyProducts?store=rajnigandha"
        );
        setShopifyProducts(response?.data?.products);
      } catch (error) {
        showPopup("error", error.message);
      }
    };

    fetchShopifyProducts();
  }, [currentPage]);

  const campaign = () => navigate("/campaign");

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const [newId, setNewId] = useState("")
  const fetchCampaignById = async (id) => {
    if(id=='read'){
      showPopup('warning', msg.readOnly)
    }else{
      try {
        const data = {
          id: id
        }
        const response = await apiCall(`/campaign/createModified_new`, "POST", data);
        if (response.status === 200) {
          openEditModal(response.data);
        }
      } catch (error) {
        showPopup("error", error.message);
      }
    }
    
  };

  const fetchCampaignUpdateById = async () => {
    setLoading(true);

    try {
      const payload = {
        id : newId,
        name: newCampaignName,
        description: newDes,
        startDate: newStart,
        endDate: newEnd,
        startTime: newStartTime,
        endTime: newEndTime,
        productName: productName,
        productWeightage: productWeightage,
        pointType: pointType,
        gold: gold,
        silver: silver,
        platinum: platinum,
        blue: blue,
        welcome: welcome,
        status: status,
      }


      const response = await apiCall(`/campaign/createModified_new`, "POST", payload);
      if (response.status === 200) {
        
        fetchCampaigns();
        setShowModal(false)
        showPopup('success', 'Campaign Updated Successfully');
      }
      setLoading(false);
    } catch (error) {
      showPopup('error', 'Error updating campaign ');

    }

  };

  const handleConfirmDelete = async () => {
    try {
      const response = await apiCall(`/campaign/delete?id=${productToDelete}&store=rajnigandha`, "DELETE", {});
      if (response.status === 200) {
        showPopup("success", "Deleted Campaign successfully");
        fetchCampaigns(); 
      }
    } catch (error) {
      showPopup("success", "Error deleting campaign");
    } finally {
      setIsPopupVisible(false);
      setProductToDelete(null); 
    }
  };
  const closePopup = () => {
    setShowPopupStatusChange(false);
    setSelectedCampaign(null);
  };

  const confirmStatusChange = () => {
    if (selectedCampaign) {
      const updatedCampaigns = campaigns.map((campaign) =>
        campaign.id === selectedCampaign.id
          ? {
            ...campaign,
            status: selectedCampaign.status === "Active" ? "Inactive" : "Active",
          }
          : campaign
      );
      setCampaigns(updatedCampaigns);
    }
    closePopup();
  };

  const openEditModal = (campaign) => {
    setNewId(campaign.id)
    setSelectedCampaign(campaign);
    setNewCampaignName(campaign.name);
    setNewDes(campaign.description);
    setNewStart(campaign.startDate);
    setNewEnd(campaign.endDate);
    setNewStartTime(campaign.startTime);
    setNewEndTime(campaign.endTime);
    setWelcome(campaign.welcome);
    setBlue(campaign.blue);
    setSilver(campaign.silver);
    setGold(campaign.gold);
    setPlatinum(campaign.platinum);
    setStatus(campaign.status);
    setPointType(campaign.pointType);
    setProductName(campaign.productName);
    setProductWeightage(campaign.productWeightage);

    setShowModal(true);
  };

  const handleCampaignNameChange = (e) => setNewCampaignName(e.target.value);
  const handleCampaignDescriptionChange = (e) => setNewDes(e.target.value);
  const handleStartDateChange = (e) => setNewStart(e.target.value);
  const handleEndDateChange = (e) => setNewEnd(e.target.value);
  const handleStartTimeChange = (e) => setNewStartTime(e.target.value);
  const handleEndTimeChange = (e) => setNewEndTime(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.checked ? 'Active' : 'Inactive');
  const handlePointTypeChange = (e) => setPointType(e.target.value);
  const handleWelcomeChange = (e) => setWelcome(e.target.value);
  const handleBlueChange = (e) => setBlue(e.target.value);
  const handleSilverChange = (e) => setSilver(e.target.value);
  const handleGoldChange = (e) => setGold(e.target.value);
  const handlePlatinumChange = (e) => setPlatinum(e.target.value);

  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState([])

 

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  
  const transformedData = campaigns.map((item) => ({
    ...item,
    startDate: formatDate(item.startDate),
    endDate: formatDate(item.endDate),
  }));


    const data = {};

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-2xl font-bold">Campaign List</h1>
        <div className="space-x-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={campaign}
          >
            Add Campaign
          </button>
          {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={campaignList}>Campaign List</button> */}
        </div>
      </div>

      <div className="overflow-x-scroll">
        <table className="table-auto border border-gray-300 w-[1500px]">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Weight</th>
              <th className="border border-gray-300 px-4 py-2">SKU</th>
              <th className="border border-gray-300 px-4 py-2">Start Date</th>
              <th className="border border-gray-300 px-4 py-2">End Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transformedData.map((campaign) =>
              Object.values(campaign.product_detail).map((product, index) => (
                <tr key={`${campaign.id}-${index}`} className="text-gray-700">
                  {index === 0 && (
                    <>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={Object.keys(campaign.product_detail).length}
                      >
                        {campaign.id}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={Object.keys(campaign.product_detail).length}
                      >
                        {campaign.name}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={Object.keys(campaign.product_detail).length}
                      >
                        {campaign.description}
                      </td>
                    </>
                  )}


                  <td className="border border-gray-300 px-4 py-2">
                    {product.productName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.productWeightage}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{product.sku}</td>


                  {index === 0 && (
                    <>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={Object.keys(campaign.product_detail).length}
                      >
                        {campaign.startDate}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={Object.keys(campaign.product_detail).length}
                      >
                        {campaign.endDate}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2"
                        rowSpan={Object.keys(campaign.product_detail).length}
                      >
                        {campaign.status}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2 text-left whitespace-nowrap"
                        rowSpan={Object.keys(campaign.product_detail).length}
                      >
                        <NavLink
                          onClick={() => fetchCampaignById(campaign.id)}
                          className="text-blue-500 hover:text-blue-700 mx-2 cursor-pointer"
                        >
                          <EditIcon />
                        </NavLink>
                          <DeleteIcon
                          className="text-red-500 hover:text-red-700 mx-2 cursor-pointer"
                          onClick={() => handleDeleteClick(campaign.id)}
                        />
                       
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end items-center">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="px-4 text-lg font-semibold text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Popup */}
      {showPopupStatusChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-md w-96">
            <h2 className="text-xl font-base mb-6">Confirmation</h2>
            <p>
              Are you sure you want to change the status of ?
              <b className="text-green-600 ml-4">{selectedCampaign?.name}</b>
            </p>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                onClick={confirmStatusChange}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex overflow-y-auto justify-center items-center ">
          <div className="bg-white p-6 rounded-md shadow-md w-[90%]">
            <h2 className="text-2xl font-semibold mt-8">Update Campaign</h2>
            <div className="grid grid-cols-2 gap-6">

              {/* Left Side */}
              <div className="bg-white p-4 rounded-md shadow-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Campaign Name *</label>
                  <input
                    type="text"
                    placeholder="Campaign Name"
                    value={newCampaignName}
                    // onChange={handleCampaignNameChange}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
                        handleCampaignNameChange(e);
                      }
                    }}
                    className="w-full border rounded-md p-2 mb-4"
                  />
                  {/* {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>} */}
                </div>
                {/* Campaign Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Campaign Description *</label>
                  <textarea
                    placeholder="Campaign Description"
                    value={newDes}
                    // onChange={handleCampaignDescriptionChange}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
                        handleCampaignDescriptionChange(e); // Allow only letters and spaces
                      }
                    }}
                    className="w-full border rounded-md p-2 mb-4"
                  />

                  {/* {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )} */}
                </div>
                {/* Start Date and End Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                    <input
                      type="date"
                      value={newStart}
                      onChange={handleStartDateChange}
                      className="w-full border rounded-md p-2"
                    />

                   </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date *</label>
                    <input
                      type="date"
                      value={newEnd}
                      onChange={handleEndDateChange}
                      className="w-full border rounded-md p-2"
                    />

                   </div>
                </div>
                {/* Start Time and End Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time *</label>
                    <input
                      type="time"
                      value={newStartTime}
                      onChange={handleStartTimeChange}
                      className="w-full border rounded-md p-2"
                    />

                    {/* {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>} */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time *</label>
                    <input
                      type="time"
                      value={newEndTime}
                      onChange={handleEndTimeChange}
                      className="w-full border rounded-md p-2"
                    />

                   </div>
                </div>




                {/* Product Name and Product Weightage */}
                <div className="grid grid-cols-2 gap-4">
                   
                </div>

                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={status === "Active"}
                      onChange={handleStatusChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2"> {status}</span>
                  </label>
                </div>
              </div>


              {/* Right Side */}
              <div className="bg-white p-4 rounded-md shadow-md space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="pointType"
                      value="Multiplier"
                      checked={pointType === "Multiplier"}
                      onChange={handlePointTypeChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Multiplier</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="pointType"
                      value="Points"
                      checked={pointType === "Points"}
                      onChange={handlePointTypeChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Points</span>
                  </label>
                </div>

                {/* Tier Inputs */}
                <div className="space-y-4">
                  {/* Welcome Card */}
                  <div className="flex items-center space-x-4 p-2 bg-pink-200 rounded-md">
                    <label className="w-1/3 capitalize">Welcome</label>
                    <input
                      type="number"
                      placeholder="Welcome"
                      value={welcome}
                      // onChange={handleWelcomeChange}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value >= 0 || value === "") {
                          handleWelcomeChange(e); // Only call handleChange for non-negative values
                        }
                      }}
                      className="w-full border rounded-md p-2 bg-pink-100"
                    />

                  </div>

                  {/* Blue Card */}
                  <div className="flex items-center space-x-4 p-2 bg-blue-100 rounded-md">
                    <label className="w-1/3 capitalize">Blue</label>
                    <input
                      type="number"
                      placeholder="Blue"
                      value={blue}
                      // onChange={handleBlueChange}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value >= 0 || value === "") {
                          handleBlueChange(e); // Only call handleChange for non-negative values
                        }
                      }}
                      className="w-full border rounded-md p-2 bg-blue-100"
                    />

                  </div>

                  {/* Silver Card */}
                  <div className="flex items-center space-x-4 p-2 bg-gray-200 rounded-md">
                    <label className="w-1/3 capitalize">Silver</label>
                    <input
                      type="number"
                      placeholder="Silver"
                      value={silver}
                      // onChange={handleSilverChange}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value >= 0 || value === "") {
                          handleSilverChange(e); // Only call handleChange for non-negative values
                        }
                      }}
                      className="w-full border rounded-md p-2 bg-gray-100"
                    />

                  </div>

                  {/* Gold Card */}
                  <div className="flex items-center space-x-4 p-2 bg-yellow-100 rounded-md">
                    <label className="w-1/3 capitalize">Gold</label>
                    <input
                      type="number"
                      placeholder="Gold"
                      value={gold}
                       onChange={(e) => {
                        const value = e.target.value;
                        if (value >= 0 || value === "") {
                          handleGoldChange(e); // Only call handleChange for non-negative values
                        }
                      }}
                      className="w-full border rounded-md p-2 bg-yellow-100"
                    />
                  </div>

                  {/* Platinum Card */}
                  <div className="flex items-center space-x-4 p-2 bg-[#E5E1E6] rounded-md">
                    <label className="w-1/3 capitalize">Platinum</label>
                    <input
                      type="number"
                      placeholder="Platinum"
                      value={platinum}
                      // onChange={handlePlatinumChange}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value >= 0 || value === "") {
                          handlePlatinumChange(e); // Only call handleChange for non-negative values
                        }
                      }}
                      className="w-full border rounded-md p-2 bg-gray-200"
                    />

                  </div>
                </div>

              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                // Add your save logic
                onClick={() => fetchCampaignUpdateById(campaign.id)}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold text-gray-800">Are you sure?</h2>
            <p className="mt-4 text-gray-600">
              Do you really want to delete this campaign?.
            </p>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md font-medium transition duration-200 hover:bg-gray-400"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-5 py-2 rounded-md font-medium transition duration-200 hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>

      )}
      <Toast />
    </div>
  );
}

export default CampaignList;

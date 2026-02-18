import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../api/Api';
import { showPopup } from '../reusable/Toast';
import Toast from '../reusable/Toast';
import { HeaderContext } from '../reusable/HeaderContext';
import MultipleSelect from './MultiSelect';
import msg from "../reusable/msg.json"
function  Campaign() {
  const navigate = useNavigate();
  const { selectedValue } = useContext(HeaderContext);

  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    status: "Active",
    pointType: "Multiplier",
    welcome: "",
    blue: "",
    silver: "",
    gold: "",
    platinum: "",
    store: selectedValue
  });

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchShopifyProducts = async () => {
      try {
        const response = await apiCall('/points/fetchShopifyProducts?store=rajnigandha');
        setShopifyProducts(response?.data?.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchShopifyProducts();
  }, []);

  const campaignList = () => {
    navigate('/campaign-list');
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    // Update formData dynamically
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? "Active" : "Inactive") : value,
    }));

    // Validate dates dynamically
    if (name === "startDate" || name === "endDate") {
      const startDate = name === "startDate" ? new Date(value) : new Date(formData.startDate);
      const endDate = name === "endDate" ? new Date(value) : new Date(formData.endDate);

      // Check if dates are valid
      if (name === "startDate" && formData.endDate && startDate > endDate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          startDate: "Start date cannot be later than end date.",
          endDate: "End date cannot be earlier than start date.",
        }));
      } else if (name === "endDate" && formData.startDate && endDate < startDate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          endDate: "End date cannot be earlier than start date.",
          startDate: "Start date cannot be later than end date.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          startDate: "",
          endDate: "",
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Campaign Name
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required.';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Campaign name must be at least 3 characters long.';
    }

    // Campaign Description
    if (!formData.description.trim()) {
      newErrors.description = 'Campaign description is required.';
    } else if (formData.description.length < 5) {
      newErrors.description = 'Campaign description must be at least 5 characters long.';
    }

    // Start Date
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    // End Date
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required.';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date.';
    }

    // Start Time
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required.';
    }

    // End Time
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required.';
    } else if (
      formData.startDate === formData.endDate &&
      formData.startTime &&
      formData.endTime &&
      formData.endTime <= formData.startTime
    ) {
      newErrors.endTime = 'End time must be after start time.';
    }

    // Product Name
    if (!selectedProducts || selectedProducts.length === 0) {
      newErrors.productName = 'At least one product must be selected.';
    }

    // Status
    if (!formData.status) {
      newErrors.status = 'Campaign status is required.';
    }

    // Point Type
    if (!formData.pointType) {
      newErrors.pointType = 'Point type is required.';
    }

    // Points for Membership Levels
    const membershipLevels = ['welcome', 'blue', 'silver', 'gold', 'platinum'];
    membershipLevels.forEach((level) => {
      if (isNaN(formData[level]) || formData[level] < 0) {
        newErrors[level] = `${level.charAt(0).toUpperCase() + level.slice(1)} points must be a non-negative number.`;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (data) => {
    if (data == 'read') {
      showPopup('warning', msg.readOnly)
    } else {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);

      try {
        const productDetail = selectedProducts.reduce((acc, product, index) => {
          acc[`p${index + 1}`] = {
            product_id: product.id,
            productName: product.title,
            productWeightage: product?.variants[0].weight + product?.variants[0].weight_unit,
            sku: product?.variants[0].sku,
          };
          return acc;
        }, {});

        const payload = {
          ...formData,
          product_detail: productDetail,
        };


        const response = await apiCall('/campaign/createModified_new', 'POST', JSON.stringify(payload));

        if (response.status === 201) {
          showPopup('success', 'Campaign Created Successfully');
          setLoading(false);
          setFormData({
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            status: "Active", // Default values
            pointType: "Multiplier",
            welcome: "",
            blue: "",
            silver: "",
            gold: "",
            platinum: "",
            store: selectedValue // Maintain selectedValue
          });

        } else if (response.status === 200) {
          showPopup('warning', 'Campaign already exists');
          setLoading(false);
        }
      } catch (error) {
        showPopup('error', 'Something went wrong');
        console.error('Error creating campaign:', error);
        setLoading(false);
      }
    }
  };

  const data = {};

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Campaign Management</h1>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md" onClick={campaignList}>
            Campaign List
          </button>
        </div>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side Form */}
        <div className="bg-white p-4 rounded-md shadow-md space-y-4">
          <div className="flex space-x-4">
            {/* Campaign Name */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Campaign Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
                    handleChange(e);
                  }
                }}
                className={`w-full mt-1 p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Campaign Name"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Campaign Description */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Campaign Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
                    handleChange(e); // Allow only letters and spaces
                  }
                }}
                className={`w-full mt-1 p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Campaign Description"
                required
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>


          {/* Start Date and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]} // Disable past dates
                className={`w-full mt-1 p-2 border rounded-md ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                // min={formData.startDate} // Restricts to the selected start date or later
                className={`w-full mt-1 p-2 border rounded-md ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                required
              />

              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>
          {/* Start Time and End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime || '00:00'}  // Default value for start time
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-md ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime || '00:00'}  // Default value for end time
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-md ${errors.endTime ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
            </div>
          </div>

          {/* Product Name and Product Weightage */}
          <div className="">
            <MultipleSelect
              options={shopifyProducts}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
            <div>
              {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
            </div>
          </div>

          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="status"
                checked={formData.status === "Active"}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2">{formData.status}</span>
            </label>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="bg-white p-4 rounded-md shadow-md space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="pointType"
                value="Multiplier"
                checked={formData.pointType === 'Multiplier'}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2">Multiplier</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="pointType"
                value="Points"
                checked={formData.pointType === 'Points'}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2">Points</span>
            </label>
          </div>

          <div className="space-y-4">

            <div className="flex items-center space-x-4 p-2 bg-pink-200 rounded-md">
              <label className="w-1/3 capitalize">Welcome</label>
              <input
                onWheel={(e) => e.target.blur()}
                type="number"
                name="welcome"
                value={formData.welcome}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 || value === "") {
                    handleChange(e);
                  }
                }}
                className="w-2/3 p-1 border rounded-md"
                placeholder="Welcome"
              />
            </div>


            {/* Blue Card */}
            <div className="flex items-center space-x-4 p-2 bg-blue-100 rounded-md">
              <label className="w-1/3 capitalize">Blue</label>
              <input
                onWheel={(e) => e.target.blur()}
                type="number"
                name="blue"
                value={formData.blue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 || value === "") {
                    handleChange(e);
                  }
                }}
                className="w-2/3 p-1 border rounded-md"
                placeholder="Blue"
              />
            </div>

            {/* Silver Card */}
            <div className="flex items-center space-x-4 p-2 bg-gray-200 rounded-md">
              <label className="w-1/3 capitalize">Silver</label>
              <input
                onWheel={(e) => e.target.blur()}
                type="number"
                name="silver"
                value={formData.silver}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 || value === "") {
                    handleChange(e);
                  }
                }}
                className="w-2/3 p-1 border rounded-md"
                placeholder="Silver"
              />
            </div>

            {/* Gold Card */}
            <div className="flex items-center space-x-4 p-2 bg-yellow-100 rounded-md">
              <label className="w-1/3 capitalize">Gold</label>
              <input
                onWheel={(e) => e.target.blur()}
                type="number"
                name="gold"
                value={formData.gold}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 || value === "") {
                    handleChange(e);
                  }
                }}
                className="w-2/3 p-1 border rounded-md"
                placeholder="Gold"
              />
            </div>

            {/* Platinum Card */}
            <div className="flex items-center space-x-4 p-2 bg-[#E5E1E6] rounded-md">
              <label className="w-1/3 capitalize">Platinum</label>
              <input
                onWheel={(e) => e.target.blur()}
                type="number"
                name="platinum"
                value={formData.platinum}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 || value === "") {
                    handleChange(e);
                  }
                }}
                className="w-2/3 p-1 border rounded-md"
                placeholder="Platinum"
              />
            </div>

          </div>

        </div>

      </form>
      <div className='py-4 px-4 w-full text-end'>
        {data?.role_permissions?.Management?.write ? <>
          <button
            onClick={handleSubmit}
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"} {/* Conditionally render text */}
          </button>
        </> : <>
          <button
            onClick={() => handleSubmit('read')}
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Creating..." : "Create"} {/* Conditionally render text */}
          </button>
        </>}

      </div>
      <Toast />
    </div>
  );
}

export default Campaign;
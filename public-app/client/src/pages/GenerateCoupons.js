import React, { useState, useEffect } from "react";
import { apiCall } from "../api/Api";
import { showToast } from "../reusable/Toast";
import Toast from '../reusable/Toast';
import LoaderSpiner from '../reusable/LoaderSpiner';

function GenerateCoupons() {
  const [allProduct, setAllProduct] = useState([]);
  const [weightageOptions, setWeightageOptions] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  // Using one state object to manage all form fields
  const [formData, setFormData] = useState({
    productName: "",
    productWeightage: "",
    numberOfCoupons: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    rewardPoints: "",
    description: "",
    createdBy: "AdminUser",  // You can set a default value
  });

  // Fetch the list of products
  const getAllProduct = async () => {
    try {
      const response = await apiCall("/product/list", "get");
      if (response.status === 200) {
        setAllProduct(response.data);
      }
    } catch (error) {
      console.error("Error calling the API:", error?.response?.data?.message?.errors || error?.message);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  // Handle product selection and update weightage options
  const handleProductChange = (e) => {
    const selectedProductName = e.target.value;
    setFormData({ ...formData, productName: selectedProductName });
 
    const selectedProductData = allProduct.find(product => product.product_name === selectedProductName);
 
    if (selectedProductData) {
      setWeightageOptions(selectedProductData?.product_weight.weight);
    } else {
      setWeightageOptions([]);
    }
  };

  // Generic function to handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission and pass data to the API
  const handleSubmit = async () => {
    setShowLoader(true)
    const couponData = {
      ...formData,
      startDate: `${formData.startDate}T${formData.startTime}:00Z`, // Combine date and time
      endDate: `${formData.endDate}T${formData.endTime}:00Z`,       // Combine date and time
      start_time: `${formData.startDate}T${formData.startTime}:00Z`,
      end_time: `${formData.endDate}T${formData.endTime}:00Z`,
    };

    try {
      const response = await apiCall('/coupon/create', 'post', couponData);
      if (response.status === 201) {
        
        showToast('Staff updated successfully!', 'success');
        setFormData('')
        setShowLoader(false)
      } else {
        alert('Error generating coupons');
        setShowLoader(false)
      }
    } catch (error) {
      console.error('Error generating coupons:', error);
      setShowLoader(false)
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 shadow-md">
         {showLoader === true ? <LoaderSpiner text="Loading ..." /> : null}
      <h1 className="text-3xl font-semibold mb-6">Generate Coupons</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block font-medium mb-2">Product Name</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              name="productName"
              value={formData.productName}
              onChange={handleProductChange}
            >
              <option value="">Select</option>
              {allProduct.map((product) => (
                <option key={product.id} value={product.product_name}>
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Weightage */}
          <div>
            <label className="block font-medium mb-2">Product Weightage</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              name="productWeightage"
              value={formData.productWeightage}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {weightageOptions.map((weight, index) => (
                <option key={index} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>

          {/* No. of Coupons */}
          <div>
            <label className="block font-medium mb-2">No. of Coupons</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg"
              name="numberOfCoupons"
              value={formData.numberOfCoupons}
              onChange={handleChange}
              placeholder="Enter number"
            />
          </div>

          {/* Expiry Date */}
          <div className="col-span-1 md:col-span-2">
            <label className="block font-medium mb-2">Expiry Date</label>
            <div className="grid grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              {/* End Date */}
              <div>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
              {/* Start Time */}
              <div>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>
              {/* End Time */}
              <div>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Reward Points */}
          <div>
            <label className="block font-medium mb-2">Reward Points</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg"
              name="rewardPoints"
              value={formData.rewardPoints}
              onChange={handleChange}
              placeholder="Enter points"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-2">Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Generate Coupons
          </button>
        </div>
      </div>
      <Toast />
    </div>
  );
}

export default GenerateCoupons;

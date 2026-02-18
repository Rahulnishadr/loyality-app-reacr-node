import React, { useState } from "react";
import { apiCall } from "../api/Api";
import { useNavigate } from "react-router-dom";

const AddCouponProduct = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [weightage, setWeightage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState("");

  const handleAddProduct = async () => {
    if (!productName || !weightage) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const payload = {
      productName,
      productWeightage: weightage,
      status: isActive ? "active" : "inactive",
    };

    try {
      const response = await apiCall('/product/createProduct', 'POST', payload);

      if (response.status === 200) {
        setMessage("Product added successfully!");
        setProductName("");
        setWeightage("");
        setIsActive(true);
      }
    } catch (error) {
      setMessage("Failed to add product. Please try again.");
      console.error("Error:", error);
    }
  };

 

  const productlist = () => {
    navigate('/product-coupon-list');
  };

  return (


    <div className="w-full mx-auto p-8 shadow-md">
      <div className="flex justify-between items-center mb-4">

        <h1 className="text-2xl font-medium">Product Management</h1>
        <div className="space-x-2">
          {/* <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md" onClick={addproduct}>
            Add Product
          </button> */}
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md" onClick={productlist}>
            Product List
          </button>
        </div>
      </div>
      <div className="flex justify-center h-96 w-full mt-6">
        <div className="relative flex flex-col items-start p-6 bg-white shadow-md rounded-md">
          {message && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-green-600 p-2 rounded shadow-md">
              {message}
            </div>
          )}
          <h1 className="text-lg font-medium mb-4">Add Product</h1>
          <div className="w-full max-w-md ">
            <div className="mb-4">
              <label className="block text-sm font-base mb-1" htmlFor="productName">
                Product Name<span className="text-red-500">*</span>
              </label>
              <input
                id="productName"
                type="text"
                placeholder="Enter Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-96 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-base mb-1" htmlFor="weightage">
                Weightage<span className="text-red-500">*</span>
              </label>
              <input
                id="weightage"
                type="text"
                placeholder="Enter Product Weightage"
                value={weightage}
                onChange={(e) => setWeightage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <label className="block text-sm font-base" htmlFor="status">
                {isActive ? "Active" : "Inactive"}
              </label>
              <div className="flex items-center">
                <input
                  id="status"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleAddProduct}
              className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCouponProduct;

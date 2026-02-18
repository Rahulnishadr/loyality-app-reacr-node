import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { apiCall } from "../api/Api";
import { showPopup } from "../reusable/Toast";

const UpdateProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { productName: initialProductName, productWeightage, status } = location.state || {};

    const { id } = useParams();


    const [productName, setProductName] = useState(initialProductName || "");
    const [weightage, setWeightage] = useState(productWeightage || "");
    const [isActive, setIsActive] = useState(status === "active");
    

    const handleBackClicked = () => navigate("/product-coupon-list");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productName.trim() || !weightage.trim()) {
            
            return;
        }

        const payload = {
            id : id,
            productName,
            productWeightage: weightage,
            status: isActive ? "active" : "inactive",
        };

        try {
            const response = await apiCall("/product/updateProduct", 'PUT', payload);


            if (response.status === 200) {
                navigate('/product-coupon-list');
            }
            
        } catch (error) {
            showPopup("error", error.message);
        }
    };

    return (
        <div className="w-full mx-auto p-6 h-screen bg-white shadow-md rounded-md">
        <div className="flex gap-4 my-3">
            <button
                className="px-1 py-1 bg-sky-500 rounded-md text-white text-2xl font-extrabold hover:bg-blue-600"
                onClick={handleBackClicked}
            >
                <IoIosArrowBack />
            </button>
        </div>
        <h2 className="text-xl font-normal mb-4">Update Product</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-4 w-96">
                <label className="block font-medium text-gray-700 mb-1">
                    Product Name<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-4 w-96">
                <label className="block font-medium text-gray-700 mb-1">
                    Weightage<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={weightage}
                    onChange={(e) => setWeightage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-6 flex items-center justify-between w-96">
                <label htmlFor="status">{isActive ? "Active" : "Inactive"}</label>
                <input
                    id="status"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-96"
            >
                Update Product
            </button>
        </form>
    </div>
    );
};

export default UpdateProduct;

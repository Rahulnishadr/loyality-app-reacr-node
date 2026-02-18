import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

import { apiCall } from "../api/Api";


const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const productsPerPage = 5;

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = await apiCall('/product/getProduct', 'GET', {});
            if (response.status === 200) {
                setProducts(response.data);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error.message);
            // if(error.message){
            //     setLoading(false)
            // }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteConfirm = async () => {
        try {
            const response = await apiCall(`/product/deleteProduct/${productToDelete}`, 'DELETE', {});
            if (response.status === 200) {
                setProducts(products.filter((product) => product.id !== productToDelete));
            }
        } catch (error) {
            console.error("Error deleting product:", error.message);
        } finally {
            setShowModal(false);
            setProductToDelete(null);
        }
    };


     const addproduct = () => {
    navigate('/add-coupon-product');
  };

    const totalPages = Math.ceil(products.length / productsPerPage);
    const currentProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full p-3">
             <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-medium">Product Management</h1>
                <div className="space-x-2">
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md" onClick={addproduct}>
                        Add Product
                    </button>
                   
                </div>
            </div>
        <div className="container mx-auto px-2 py-6">
            <h2 className="text-2xl font-semibold mb-4">Product List</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="border px-4 py-2 text-center">S.No.</th>
                        <th className="border px-4 py-2 text-center">Product Name</th>
                        <th className="border px-4 py-2 text-center">Weightage</th>
                        <th className="border px-4 py-2 text-center">Status</th>
                        <th className="border px-4 py-2 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts?.map((product, index) => (
                        <tr key={product?.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2 text-center">
                                {(currentPage - 1) * productsPerPage + index + 1}
                            </td>
                            <td className="border px-4 py-2 text-center">{product?.productName}</td>
                            <td className="border px-4 py-2 text-center">{product?.productWeightage}</td>
                            <td className="border px-4 py-2 text-center">{product?.status}</td>
                            <td className="border px-4 py-2 text-center">
                                <NavLink to={`/updaproductte-/${product?.id}`} state={product}>
                                    <EditIcon className="text-blue-500 hover:text-blue-700 mx-2 cursor-pointer" />
                                </NavLink>
                                <DeleteIcon
                                    className="text-red-500 hover:text-red-700 mx-2 cursor-pointer"
                                    onClick={() => {
                                        setProductToDelete(product.id);
                                        setShowModal(true);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-md shadow-md w-96">
                        <h2 className="text-xl mb-4">Confirmation</h2>
                        <p>Are you sure you want to delete this product?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button className="px-4 py-2 bg-gray-100 rounded-md" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={handleDeleteConfirm}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end items-center mt-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                    Previous
                </button>
                <span>{`${currentPage} / ${totalPages}`}</span>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>
        </div>
        </div>
    );
};

export default ProductList;

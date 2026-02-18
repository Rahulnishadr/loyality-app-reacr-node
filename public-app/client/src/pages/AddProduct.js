import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { apiCall } from '../api/Api';
import LoaderSpiner from '../reusable/LoaderSpiner';
import { showPopup } from '../reusable/Toast';
import { useLocation } from 'react-router-dom';

function AddProduct() {
    const initialFormState = {
        productName: '',
        productSku: '',
        stock: '',
        minQuantity: '',
        maxQuantity: '',
        productImage: null,
        productThumbnail: [],
        rewardPoints: '',
        startDate: '',
        endDate: '',
        netWeight: '',
        details: '',
        description: '',
        showCategory: '',
        showTag: '',
        showProduct: '',
    };

    const location = useLocation();
    const { id } = location?.state || '';

    

    const [showLoader, setShowLoader] = useState(false);

    const [formData, setFormData] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        if (name === 'productImage') {
            setFormData(prev => ({ ...prev, productImage: e.target.files[0] }));
        } else if (name === 'productThumbnail') {
            const files = Array.from(e.target.files);
            if (files.length > 6) {
                setFormErrors(prev => ({ ...prev, productThumbnail: 'You can upload a maximum of 6 thumbnails.' }));
            } else {
                setFormErrors(prev => ({ ...prev, productThumbnail: '' }));
                setFormData(prev => ({ ...prev, productThumbnail: files }));
            }
        }
    };

    const handleRichTextChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.productName) errors.productName = 'Product Name is required';
        if (!formData.productSku) errors.productSku = 'Product SKU is required';
        if (!formData.rewardPoints || formData.rewardPoints <= 0)
            errors.rewardPoints = 'Reward Points must be a positive number';
        if (!formData.netWeight) errors.netWeight = 'Net Weight is required';
        if (!formData.startDate) errors.startDate = 'Start Date is required';
        if (!formData.endDate) errors.endDate = 'End Date is required';
        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate)
            errors.endDate = 'End Date must be after Start Date';
        if (!formData.productImage) errors.productImage = 'Product Image is required';
        if (formData.productThumbnail.length === 0)
            errors.productThumbnail = 'At least one thumbnail is required';
        if (!formData.minQuantity || formData.minQuantity <= 0)
            errors.minQuantity = 'Min Quantity must be a positive number';
        if (!formData.maxQuantity || formData.maxQuantity <= 0)
            errors.maxQuantity = 'Max Quantity must be a positive number';

        // New validations
        if (!formData.showProduct) errors.showProduct = 'Please select a product visibility status';
        if (!formData.showCategory) errors.showCategory = 'Please select a category visibility status';
        if (!formData.stock) errors.stock = 'Please select stock availability';
        if (!formData.showTag) errors.showTag = 'Please select a tag visibility status';

        if (!formData.details.trim()) errors.details = 'Details are required';
        if (!formData.description.trim()) errors.description = 'Description is required';

        // Thumbnail validation for file size and type
        formData.productThumbnail.forEach((file, index) => {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                errors.productThumbnail = `Thumbnail ${index + 1} exceeds 2MB size limit.`;
            }
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                errors.productThumbnail = `Thumbnail ${index + 1} must be a JPEG or PNG image.`;
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        setShowLoader(true);

        e.preventDefault();
        if (validateForm()) {
            const payLoad = new FormData();
            payLoad.append('productName', formData.productName);
            payLoad.append('productSku', formData.productSku);
            payLoad.append('stock', formData.stock);
            payLoad.append('minQuantity', formData.minQuantity);
            payLoad.append('maxQuantity', formData.maxQuantity);
            payLoad.append('productImage', formData.productImage);
            for (let i = 0; i < formData.productThumbnail.length; i++) {
                payLoad.append('productThumbnail', formData.productThumbnail[i]);
            }
            payLoad.append('rewardPoints', formData.rewardPoints);
            payLoad.append('netWeight', formData.netWeight);

            payLoad.append('startDate', formData.startDate);
            payLoad.append('endDate', formData.endDate);
            payLoad.append('showCategory', formData.showCategory);
            payLoad.append('showTag', formData.showTag);

            payLoad.append('description', formData.description);
            payLoad.append('details', formData.details);

            

            try {
                const header = {
                    'Content-Type': 'multipart/form-data'
                }

                const response = await apiCall('/dsProducts/addProduct', "POST", payLoad, header);
                if (response.status === 201) {
                    setShowLoader(false)
                    showPopup('success', response.message);
                }
            }
            catch (error) {
                showPopup('error', error.message);

            }

            setFormData(initialFormState);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 w-full mx-auto shadow-md bg-white">
            {showLoader && <LoaderSpiner text="Loading ..." />}

            <h2 className="text-3xl font-medium mb-6">{id ? 'Update Product' : 'Add Product'}</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-semibold mb-1">Product Name *</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        className={`border p-2 w-full rounded-md ${formErrors.productName ? 'border-red-500' : ''}`}
                    />
                    {formErrors.productName && <p className="text-red-500 text-sm">{formErrors.productName}</p>}
                </div>
                <div>
                    <label className="block font-semibold mb-1">Product SKU *</label>
                    <input
                        type="text"
                        name="productSku"
                        value={formData.productSku}
                        onChange={handleInputChange}
                        className={`border p-2 w-full rounded-md ${formErrors.productSku ? 'border-red-500' : ''}`}
                    />
                    {formErrors.productSku && <p className="text-red-500 text-sm">{formErrors.productSku}</p>}
                </div>
                <div>
                    <label className="block font-semibold mb-1">Reward Points *</label>
                    <input
                        type="number"
                        name="rewardPoints"
                        value={formData.rewardPoints}
                        onWheel={(e) => e.target.blur()}
                        onChange={handleInputChange}
                        className={`border p-2 w-full rounded-md ${formErrors.rewardPoints ? 'border-red-500' : ''}`}
                    />
                    {formErrors.rewardPoints && <p className="text-red-500 text-sm">{formErrors.rewardPoints}</p>}
                </div>
                <div>
                    <label className="block font-semibold mb-1">Net Weight *</label>
                    <input
                        type="text"
                        name="netWeight"
                        value={formData.netWeight}
                        onChange={handleInputChange}
                        className={`border p-2 w-full rounded-md ${formErrors.netWeight ? 'border-red-500' : ''}`}
                    />
                    {formErrors.netWeight && <p className="text-red-500 text-sm">{formErrors.netWeight}</p>}
                </div>
            </div>

            <h3 className="text-xl font-semibold my-4">Expiry Date</h3>
            <div className="grid grid-cols-2 gap-4 mb-4 rounded-md">
                <div>
                    <label className="block font-semibold mb-1">Start Date *</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className={`border p-2 w-full ${formErrors.startDate ? 'border-red-500' : ''}`}
                    />
                    {formErrors.startDate && <p className="text-red-500 text-sm">{formErrors.startDate}</p>}
                </div>
                <div>
                    <label className="block font-semibold mb-1">End Date *</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className={`border p-2 w-full ${formErrors.endDate ? 'border-red-500' : ''}`}
                    />
                    {formErrors.endDate && <p className="text-red-500 text-sm">{formErrors.endDate}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-semibold mb-1">Product Image *</label>
                    <input
                        type="file"
                        name="productImage"
                        onChange={handleFileChange}
                        className={`border p-2 w-full ${formErrors.productImage ? 'border-red-500' : ''}`}
                    />
                    {formErrors.productImage && <p className="text-red-500 text-sm">{formErrors.productImage}</p>}
                </div>
                <div>
                    <label className="block font-semibold mb-1">
                        Product Thumbnail * <span className="text-red-500">Maximum Six Thumbnail</span>
                    </label>
                    <input
                        type="file"
                        name="productThumbnail"
                        multiple
                        onChange={handleFileChange}
                        className={`border p-2 w-full ${formErrors.productThumbnail ? 'border-red-500' : ''}`}
                    />
                    {formErrors.productThumbnail && <p className="text-red-500 text-sm">{formErrors.productThumbnail}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-semibold mb-1">Show Product *</label>
                    <select
                        name="showProduct"
                        className={`border p-2 w-full rounded-md 
                            ${formErrors.showProduct ? 'border-red-500' : ''}
                            `}
                        value={formData.showProduct}
                        onChange={handleInputChange}>
                        <option value="">Select</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {formErrors.showProduct && <p className="text-red-500 text-sm">{formErrors.showProduct}</p>}
                </div>
                <div>
                    <label className="block font-semibold mb-1">Show Category *</label>
                    <select
                        name="showCategory"
                        className={`border p-2 w-full rounded-md ${formErrors.showCategory ? 'border-red-500' : ''}`}
                        onChange={handleInputChange}>
                        {/* Map Lagega */}
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                    {formErrors.showCategory && <p className="text-red-500 text-sm">{formErrors.showCategory}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-semibold mb-1">Stock *</label>
                    <select
                        className={`border p-2 w-full rounded-md ${formErrors.stock ? 'border-red-500' : ''}`}
                        type="select"
                        name="stock"
                        onChange={handleInputChange}>
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                    {formErrors.stock && <p className="text-red-500 text-sm">{formErrors.stock}</p>}
                </div>
                <div>
                    <label className="block font-semibold mb-1">Show Tag *</label>
                    <select name="showTag"
                        className={`border p-2 w-full rounded-md ${formErrors.showTag ? 'border-red-500' : ''}`}
                        onChange={handleInputChange}>

                        {/* Map Lagega */}
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                    {formErrors.showTag && <p className="text-red-500 text-sm">{formErrors.showTag}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-semibold mb-1">Min Quantity *</label>
                    <input
                        type="number"
                        name="minQuantity"
                        value={formData.minQuantity}
                        onChange={handleInputChange}
                        className={`border p-2 w-full rounded-md ${formErrors.minQuantity ? 'border-red-500' : ''}`}
                    />
                    {formErrors.minQuantity && <p className="text-red-500 text-sm">{formErrors.minQuantity}</p>}
                </div>
                <div>
                    <label className="block font-semibold mb-1">Max Quantity *</label>
                    <input
                        type="number"
                        name="maxQuantity"
                        value={formData.maxQuantity}
                        onChange={handleInputChange}
                        className={`border p-2 w-full rounded-md ${formErrors.maxQuantity ? 'border-red-500' : ''}`}
                    />
                    {formErrors.maxQuantity && <p className="text-red-500 text-sm">{formErrors.maxQuantity}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block font-semibold mb-1">Details</label>
                    <ReactQuill
                        value={formData.details}
                        onChange={(value) => handleRichTextChange('details', value)}
                        className="rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <ReactQuill
                        value={formData.description}
                        onChange={(value) => handleRichTextChange('description', value)}
                        className="rounded-md"
                    />

                    <div className='flex justify-end'
                        onClick={handleSubmit}
                    >
                        <button type="submit" className="mt-4 bg-blue-500 text-white px-2 py-2 w-auto rounded-md hover:bg-blue-600 transition duration-300">
                            {id ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default AddProduct;

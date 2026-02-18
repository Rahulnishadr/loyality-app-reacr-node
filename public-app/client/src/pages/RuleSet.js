/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import CustomModal from "../reusable/CustomModal";
import { apiCallLocal } from "../api/Api";
import Toast from "../reusable/Toast";
import { showPopup } from "../reusable/Toast";
import LoaderSpiner from '../reusable/LoaderSpiner';
import { HeaderContext } from "../reusable/HeaderContext"
import msg from "../reusable/msg.json";
function RuleSet() {

    const { selectedValue } = useContext(HeaderContext);

    const fixedCategories = [
        "confectionery",
        "food",
        "pan-masala"
    ];

    const [showLoader, setShowLoader] = useState(false);
    const [selectedProductName, setSelectedProductName] = useState("");
    const [filteredSKUs, setFilteredSKUs] = useState([]);
    const [registration, setRegistration] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [selectedSKU, setSelectedSKU] = useState("");

    const [expiresAfter, setExpiresAfter] = useState("")
    const [expiresType, setExpiresType] = useState("")
    const [creditAfter, setCreditAfter] = useState("")
    const [creditType, setCreditType] = useState("")

    const [open, setOpen] = useState(false);
    const [opensku, setOpensku] = useState(false);
    const [openCoupon, setOpenCoupon] = useState(false);
    const [openBonus, setOpenBonus] = useState(false);
    const [openCategorie, setOpenCategorie] = useState(false);

    const [openCOD, setOpenCOD] = useState(false);
    const [openOnlineRewards, setOpenOnlineRewards] = useState(false);
    const [openRegistration, setOpenRegistration] = useState(false);

    const [fetchShopifyProducts, setfetchShopifyProducts] = useState();
    const [fetchCategory, setfetchCategory] = useState();
    const [pointsListNew, setPointsListNew] = useState();
    const [editId, setEditId] = useState(null);
    const [skuId, setSkuId] = useState(null);
    const [bonusId, setBonusId] = useState(null);
    const [CategorieId, setCategorieId] = useState(null);
    const [OnlineId, setOnlineId] = useState(null);
    const [offlineId, setOfflineId] = useState(null);


    const handleOpen = () => setOpen(true);
    const handleOpenSKU = () => setOpensku(true);

    const [couponId, setCouponId] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleOpenCoupon = () => setOpenCoupon(true);
    const handleOpenCategorie = () => setOpenCategorie(true);
    const handleOpenCOD = () => setOpenCOD(true);
    const handleOpenOnlineRewards = () => setOpenOnlineRewards(true);


    const [currentEditId, setCurrentEditId] = useState(null);
    const [points, setPoints] = useState("");
    const [remarks, setRemarks] = useState("");
    const [Registrationremarks, setRegistrationRemarks] = useState("");

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [formDataBonus, setFormDataBonus] = useState({
        // ruleType: "bonus_campaign",
        purchaseValue: "",
        productName: "",
        points: "",
        remarks: "",
        category: "",
    });

    const [formDataCategory, setFormDataCategory] = useState({
        ruleType: "category",
        // category: "",
        points: "",
        remarks: "",
        expiresAfter: "",
        expiresType: "",
        creditAfter: "",
        creditType: "",
    });


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
        setIsEditing(false); // Reset editing state
        setFormData({
            // ruleType: "online_purchase",
            purchaseValue: "",
            points: "",
            remarks: "",
            expiresOn: "",
        }); // Reset form data
        setFilteredSKUs([])
        setIsEditing(!isEditing)
    };

    const handleClosesku = () => {
        setOpensku(false);
        setSelectedProductName("")
        setSelectedSKU("");
        setExpiresAfter("")
        setExpiresType("")
        setCreditAfter("")
        setCreditType("")
        setRemarks("")
        setPoints("")

        setFilteredSKUs([])
        setIsEditing(!isEditing)
    };

    const handleCloseCoupon = () => {
        setOpenCoupon(false);
        setIsEditing(false);
        setSelectedProductName("");
        setSelectedSKU("");
        setPoints("");
        setRemarks("");
        setExpiresAfter("");
        setExpiresType("");
        setCreditAfter("")
        setCreditType("")
        setRemarks("")
        setPoints("")

        setFilteredSKUs([])
        setIsEditing(!isEditing)
    };

    const handleDelete = async (value) => {
        const data = {
            id: value?.id,
            value_id: value?.point_conversion_online_purchase?.value[0]?.value_id,
            type: "point_conversion_online_purchase",
        }
        try {
            const response = await apiCallLocal("/points/deleteValue", "delete", data);
            if (response.status === 200) {
                getAllpointslist()
                showPopup("warning", "Delete Successful");
            }
        } catch (error) {

            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
    };

    const handleDeletesku = async (id) => {
        const data = {
            id: pointsListNew?.id,
            type: "point_conversion_based_on_sku",
            value_id: id
        }

        try {
            const response = await apiCallLocal("/points/deleteValue", "delete", data);
            if (response.status === 200) {
                getAllpointslist()
                showPopup("warning", "Delete Successful");
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
    };

    const handleDelete2XOnline = async (id) => {
        const data = {
            id: pointsListNew?.id,
            type: "twox_reward_online",
            value_id: id
        }

        try {
            const response = await apiCallLocal("/points/deleteValue", "delete", data);
            if (response.status === 200) {
                showPopup("warning", "Delete Successful");
                getAllpointslist()
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }

    };

    const handleDeleteskuRetail = async (id) => {

        const data = {
            id: pointsListNew?.id,
            type: "coupon",
            value_id: id
        }

        try {
            const response = await apiCallLocal("/points/deleteValue", "delete", data);
            if (response.status === 200) {
                showPopup("warning", "Delete Successful");
                getAllpointslist()
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
    };

    const handleDeleteskuCategory = async (id) => {

        const data = {
            id: pointsListNew?.id,
            type: "point_conversion_based_on_category",
            value_id: id
        }
        try {
            const response = await apiCallLocal("/points/deleteValue", "delete", data);
            if (response.status === 200) {
                showPopup("warning", "Delete Successful");
                getAllpointslist()
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }

    };

    const handleDeleteOffline = async (id) => {

        const data = {
            id: pointsListNew?.id,
            type: "twox_reward_offline",
            value_id: id
        }
        try {
            const response = await apiCallLocal("/points/deleteValue", "delete", data);
            if (response.status === 200) {
                showPopup("warning", "Delete Successful");
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
            const response = await apiCallLocal(`/points/fetchShopifyProducts?store=${selectedValue}`, "GET");
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
            const response = await apiCallLocal(`/points/fetchCategories?store=${selectedValue}`, "GET");
            if (response.status === 200) {

                const filterCategories = response?.collections?.filter(item => {
                    return fixedCategories?.includes(item?.handle);
                });

                setfetchCategory(filterCategories);
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
        finally{
            setShowLoader(false)
          }
    };

    const getAllpointslist = async () => {
        setShowLoader(true)
        try {
            const response = await apiCallLocal(`/points/getAll?store=${selectedValue}`, "GET");
            if (response.status === 200) {
                setPointsListNew(response?.data[0]);
                // 
                setShowLoader(false)
            }
        } catch (error) {
            setShowLoader(false)
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
        finally{
            setShowLoader(false)
          }
    };

    useEffect(() => {
        getAllfetchShopifyProducts();
        getAllCategory();
        handleToggle()
    }, [selectedValue]);

    useEffect(() => {

        getAllpointslist();
        // getAllpointsSKUlist('sku_specific');
    }, [selectedValue]);

    useEffect(() => {
        handleGetRegistration()
    }, [])

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

    const handleCloseBonus = () => {
        setOpenBonus(false);
        setIsEditing(false);
        setCurrentEditId(null);
        setFormDataBonus({
            purchaseValue: "",
            productName: "",
            points: "",
            remarks: "",
        });
        setCreditAfter("")
        setCreditType("")
        setRemarks("")
        setPoints("")

        setFilteredSKUs([])
        setIsEditing(!isEditing)
    };
    const handleCloseCategory = () => {
        setOpenCategorie(false);
        setIsEditing(false);
        setCurrentEditId(null),
            setFormDataCategory({
                ruleType: "category",
                category: "",
                points: "",
                remarks: "",

            });

        setExpiresType("");
        setExpiresAfter("");
        setCreditAfter("");
        setCreditType("");
        setFilteredSKUs([])
        setIsEditing(!isEditing)
    };

    const handleCloseCOD = () => {
        setOpenCOD(false);
        setIsEditing(false);
        setPoints("");
        setRemarks("");
        setExpiresType("");
        setExpiresAfter("");
        setCreditAfter("");
        setCreditType("");
        setSelectedProductName("")
        setFilteredSKUs([])
        setIsEditing(!isEditing)
    };

    const handleCloseOnlineRewards = () => {
        setOpenOnlineRewards(false);
        setFilteredSKUs([])
        setIsEditing(!isEditing)

        setOpenCOD(false);
        setPoints("");
        setRemarks("");

        // setExpiresOn("")
        setExpiresAfter("");
        setExpiresType("");

        setCreditAfter("");
        setCreditType("");
        setSelectedProductName("")
    };

    const handleCloseRegistration = () => {
        setOpenRegistration(false);
        setFilteredSKUs([])
        setIsEditing(!isEditing)
    };

    const handleChangeBonus = (e) => {
        const { name, value } = e.target;
        setFormDataBonus((prev) => ({ ...prev, [name]: value }));
    };
    const handleChangeCategory = (e) => {
        const { name, value } = e.target;
        setFormDataCategory((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        // 
        const formDataCreat = {
            id: pointsListNew?.id,
            type: "point_conversion_online_purchase",
            newValue: {
                // value_id: counter += 1,
                ...formData,
                expiresOn: `${formData.expiresAfter} ${formData.expiresType}`,
                credit_after_days: `${formData.creditAfter}`,
                // store:selectedValue

            }
        };

        const formDataUpdate = {
            id: pointsListNew?.id,
            type: "point_conversion_online_purchase",
            newValue: {
                value_id: editId,
                ...formData,
                expiresOn: `${formData.expiresAfter} ${formData.expiresType}`,
                credit_after_days: `${formData.creditAfter}`,
                // store:selectedValue
            }
        };

        try {
            if (isEditing) {
                // Update existing entry
                const response = await apiCallLocal('/points/updateValue', "post", formDataUpdate
                );
                if (response.status === 200) {
                    setOpen(false);
                    getAllpointslist()
                    setLoading(false)
                    // getAllpointsOnLinelist("online_purchase");
                    showPopup("success", "Login Successful");
                    setFormData({})
                }
            } else {
                // Create new entry
                const response = await apiCallLocal("/points/addValue", "POST", formDataCreat);
                if (response.status === 200) {
                    setOpen(false);
                    getAllpointslist('')
                    // getAllpointsOnLinelist("online_purchase");
                    showPopup("success", "Created successfully!");
                    setLoading(false)
                    setFormData({})

                }
            }
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message?.errors || error.message
            );
        }
    };

    const handleProductNameChange = (e) => {
        const selectedName = e.target.value;
        setSelectedProductName(selectedName);

        // Find the selected product based on the product name
        const selectedProduct = fetchShopifyProducts.find(
            (product) => product.title === selectedName
        );

        setSelectedProduct(selectedProduct);
        
        // Update the filtered SKU list based on the selected product
        setFilteredSKUs(selectedProduct ? selectedProduct.variants : []);
        // setSelectedSKU('');
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
                            type="number"
                            name="purchaseValue"
                            required
                            value={formData.purchaseValue}
                            onChange={(e) => {
                                const value = e.target.value; // Get the raw input value
                                if (value === "" || parseFloat(value) >= 0) {
                                    // Allow only non-negative numbers or an empty value
                                    handleChange(e); // Call the existing handler for valid inputs
                                }
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter purchase value"
                        />

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points:
                        </label>
                        <input
                            type="number"
                            name="points"
                            value={formData.points}
                            required
                            // onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter points awarded"
                            onChange={(e) => {
                                const value = e.target.value; // Get the raw input value
                                if (value === "" || parseFloat(value) >= 0) {
                                    // Allow only non-negative numbers or an empty value
                                    handleChange(e); // Call the existing handler for valid inputs
                                }
                            }}
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
                                required
                                value={formData.expiresAfter}
                                // onChange={handleChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        handleChange(e); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="expiresType"
                                value={formData.expiresType}
                                required
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
                            required
                            value={formData.remarks}
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
                                required
                                name="creditAfter"
                                value={formData.creditAfter}
                                // onChange={handleChange}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        handleChange(e); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="creditType"
                                value={formData.creditType}
                                required
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

                                {loading ? 'Loading...' : 'Submit'}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );

    const handleSKUChange = (e) => {
        setSelectedSKU(e.target.value);
    };
    const handlePointsChange = (e) => {
        setPoints(e.target.value);
    };

    const handleRemarksChange = (e) => {
        setRemarks(e.target.value);
    };

    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        const formDataCreat = {
            id: pointsListNew?.id,
            type: "point_conversion_based_on_sku",
            newValue: {
                // value_id: counter += 1,
                product_title: selectedProduct?.title,
                product_id: selectedProduct?.id,
                productName: selectedProductName,
                product_sku: filteredSKUs[0]?.sku,
                points: points,
                remarks: remarks,
                expiresType: expiresType,
                expiresOn: `${expiresAfter} ${expiresType}`,
                expiresAfter: expiresAfter,
                creditAfter: creditAfter,
                credit_after_days: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };

        const formDataUpdate = {
            id: pointsListNew?.id,
            type: "point_conversion_based_on_sku",
            newValue: {
                product_title: selectedProduct?.title,
                product_id: selectedProduct?.id,
                value_id: skuId,
                productName: selectedProductName,
                skuNo: filteredSKUs[0]?.sku,
                points: points,
                remarks: remarks,
                expiresType: expiresType,
                expiresOn: `${expiresAfter} ${expiresType}`,
                expiresAfter: expiresAfter,
                creditAfter: creditAfter,
                credit_after_days: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };


        try {
            let response;
            if (isEditing) {
                response = await apiCallLocal(
                    '/points/updateValue',
                    "post",
                    formDataUpdate
                );
                if (response.status === 200) {
                    setLoading(false)
                    showPopup("success", "Updated successfully!");
                    getAllpointslist()
                    setOpensku(false)

                    setSelectedProductName("");
                    setFilteredSKUs([]);
                    setPoints("");
                    setRemarks("");
                    setExpiresType("");
                    setExpiresAfter("");
                    setCreditAfter("");
                    setCreditType("");
                }
            } else {
                response = await apiCallLocal(
                    "/points/addValue",
                    "POST",
                    formDataCreat
                );
                if (response.status === 200) {
                    setLoading(false)
                    showPopup("success", "Created successfully!");
                    getAllpointslist()
                    setOpensku(false)
                    setSelectedProductName("");
                    setFilteredSKUs([]);
                    setPoints("");
                    setRemarks("");
                    setExpiresType("");
                    setExpiresAfter("");
                    setCreditAfter("");
                    setCreditType("");
                }
            }

        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message || error.message
            );
        }
        // }

    };

    const skuEditById = (id) => {
        const skuData = pointsListNew?.point_conversion_based_on_sku?.value;

        if (Array.isArray(skuData) && skuData.length > 0) {
            const foundSku = skuData.find((sku) => sku.value_id === id);

            if (foundSku) {

                setOpensku(true);
                setFilteredSKUs([{ 'sku': foundSku?.product_sku }])
                // setFilteredSKUs([foundSku.product_sku])

                // 
                setSelectedProductName(foundSku.productName);
                // setSelectedSKU(foundSku.skuNo);
                setPoints(foundSku.points);
                setRemarks(foundSku.remarks);
                setExpiresAfter(foundSku.expiresAfter);
                setExpiresType(foundSku.expiresType);
                setCreditAfter(foundSku.creditAfter);
                setCreditType(foundSku.creditType);

                setSkuId(id);
                setIsEditing(true);
            }
        }
    };


    const OnlineEditById = (valueId) => {
        const selectedRow = pointsListNew.twox_reward_online.value.find(row => row.value_id === valueId);

        if (selectedRow) {
            setSelectedProductName(selectedRow.productName);

            setFilteredSKUs([{ sku: selectedRow.product_sku }]);
            setPoints(selectedRow.points);
            setExpiresAfter(selectedRow.expiresAfter);
            setExpiresType(selectedRow.expiresType);
            setCreditAfter(selectedRow.creditAfter);
            setCreditType(selectedRow.creditType);
            setRemarks(selectedRow.remarks);

            setIsEditing(true);
            setOpenOnlineRewards(true); // Open the modal
            setOnlineId(valueId)
        }
    };

    const formContentsku = (
        <div className="flex justify-center items-center ">
            <div className="rounded-lg p-6 w-96">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="flex space-x-2">
                        {/* Product Name */}
                        <div className="flex flex-col w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name:
                            </label>
                            <select
                                // disabled={isEditing}
                                name="productName"
                                required
                                value={selectedProductName}
                                onChange={handleProductNameChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Name</option>
                                {fetchShopifyProducts?.map((product) => (
                                    <option key={product.id} value={product.title}>
                                        {product.title}
                                    </option>
                                ))}
                            </select>
                            {/* {formErrors.productName && (
                                <span className="text-red-500 text-sm">
                                    {formErrors.productName}
                                </span>
                            )} */}
                        </div>

                        {/* SKU */}
                        <div className="flex flex-col w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU :
                            </label>
                            <select
                                // disabled={isEditing}
                                name="productSKU"
                                value={selectedSKU}
                                onChange={handleSKUChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {filteredSKUs.map((variant) => (
                                    <option key={variant.id} value={variant.sku}>
                                        {variant.sku}

                                    </option>
                                ))}
                            </select>
                            {/* {formErrors.productSKU && (
                                <span className="text-red-500 text-sm">
                                    {formErrors.productSKU}
                                </span>
                            )} */}
                        </div>
                    </div>

                    {/* Points Expiry */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points Expiry:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="expiresAfter"
                                value={expiresAfter}
                                required
                                // onChange={(e) => setExpiresAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setExpiresAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="expiresType"
                                value={expiresType}
                                required
                                onChange={(e) => setExpiresType(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                <option value="days">Days</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                        {/* {formErrors.expiresAfter && (
                            <span className="text-red-500 text-sm">
                                {formErrors.expiresAfter}
                            </span>
                        )}
                        {formErrors.expiresType && (
                            <span className="text-red-500 text-sm">
                                {formErrors.expiresType}
                            </span>
                        )} */}
                    </div>

                    {/* Points */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points
                        </label>
                        <input
                            type="text"
                            name="points"
                            value={points}
                            required
                            // onChange={handlePointsChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter points"
                            onChange={(e) => {
                                const value = e.target.value; // Get the raw input value
                                if (value === "" || parseFloat(value) >= 0) {
                                    // Allow only non-negative numbers or an empty value
                                    handlePointsChange(e); // Call the existing handler for valid inputs
                                }
                            }}

                        />
                        {/* {formErrors.points && (
                            <span className="text-red-500 text-sm">{formErrors.points}</span>
                        )} */}
                    </div>

                    {/* Additional Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Note
                        </label>
                        <input
                            type="text"
                            name="remarks"
                            value={remarks}
                            required
                            onChange={handleRemarksChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter remarks"
                        />
                        {/* {formErrors.remarks && (
                            <span className="text-red-500 text-sm">{formErrors.remarks}</span>
                        )} */}
                    </div>

                    {/* Credit After */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Credit After:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="creditAfter"
                                value={creditAfter}
                                required
                                // onChange={(e) => setCreditAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setCreditAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="creditType"
                                value={creditType}
                                required
                                onChange={(e) => setCreditType(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                <option value="days">Days</option>
                                <option value="months">Months</option>
                            </select>
                        </div>
                        {/* {formErrors.creditAfter && (
                            <span className="text-red-500 text-sm">
                                {formErrors.creditAfter}
                            </span>
                        )} */}
                        {/* {formErrors.creditType && (
                            <span className="text-red-500 text-sm">
                                {formErrors.creditType}
                            </span>
                        )} */}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isEditing ? <> {loading ? 'Loading...' : 'Update'}</> : <> {loading ? 'Loading...' : 'Submit'}</>}
                    </button>
                </form>
            </div>
        </div>
    );

    const CouponEditById = (id) => {
        const couponDatas = pointsListNew?.coupon?.value;

        if (Array.isArray(couponDatas) && couponDatas.length > 0) {
            const foundCoupon = couponDatas.find((coupon) => coupon.value_id === id);

            if (foundCoupon) {

                setFilteredSKUs([{ sku: foundCoupon.skuNo }]);

                setSelectedProductName(foundCoupon.productName);
                // setSelectedSKU(foundCoupon.skuNo);
                setPoints(foundCoupon.points);
                setRemarks(foundCoupon.remarks);

                setExpiresAfter(foundCoupon.expiresOn);
                setExpiresType(foundCoupon.expiresType);
                setCreditAfter(foundCoupon.creditAfter);
                setCreditType(foundCoupon.creditType);
                setCouponId(id);
                setIsEditing(true);
                setOpenCoupon(true);
            }
        }
    };

    const RegistrationEditById = (data) => {
        setIsEditing(true);
        setOpenRegistration(true)
        let expiresAfter = "";
        let expiresType = "";
        // expiry_day expiry_day
        if (typeof data?.expiry_day === "string") {
            [expiresAfter, expiresType] = data.expiry_day.split(" ");
        }
        let creditAfter
        let creditType
        if (typeof data?.credit_day === "string") {
            [creditAfter, creditType] = data.credit_day.split(" ");
        }


        setExpiresAfter(expiresAfter)
        setExpiresType(expiresType)

        setPoints(data?.point)



        setRegistrationRemarks(data?.remarks)
        setCreditAfter(creditAfter)
        setCreditType(creditType)
        // id:1,
        // point:points, 

        // expiry_date: formattedExpiryDate,
        // expiry_day:expiresType,

        // credit_after:creditAfter,
        // credit_day: creditType
    }
    const onSubmitCoupon = async (e) => {
        setLoading(true)
        e.preventDefault();
        // let counter = 0;
        const formDataCreat = {
            id: pointsListNew?.id,
            type: "coupon",
            newValue: {
                // value_id: counter += 1,
                productName: selectedProductName,
                skuNo: filteredSKUs[0]?.sku,
                points: points,
                remarks: remarks,
                expiresType: expiresType,
                expiresOn: expiresAfter,
                creditAfter: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };

        const formDataUpdate = {
            id: pointsListNew?.id,
            type: "coupon",
            newValue: {
                value_id: couponId,
                productName: selectedProductName,
                skuNo: filteredSKUs[0]?.sku,
                points: points,
                remarks: remarks,
                expiresType: expiresType,
                expiresOn: expiresAfter,
                creditAfter: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };
        // const formData = {
        //     ruleType: "retail_coupon",
        //     productName: selectedProductName,
        //     skuNo: selectedSKU,
        //     points,
        //     remarks,
        // };

        try {
            let response;
            if (isEditing) {
                response = await apiCallLocal(
                    '/points/updateValue',
                    "post",
                    formDataUpdate
                );
                if (response.status === 200) {
                    setLoading(false)
                    showPopup("success", "Updated successfully!");
                    getAllpointslist()
                    setOpenCoupon(false)

                    setSelectedProductName("");
                    setFilteredSKUs([]);
                    setPoints("");
                    setRemarks("");
                    setExpiresType("");
                    setExpiresAfter("");
                    setCreditAfter("");
                    setCreditType("");
                }
            } else {
                response = await apiCallLocal(
                    "/points/addValue",
                    "POST",
                    formDataCreat
                );
                if (response.status === 200) {
                    setLoading(false)
                    showPopup("success", "Created successfully!");
                    getAllpointslist()
                    setOpenCoupon(false)
                    // setSelectedProductName("");
                    // setSelectedSKU("");
                    // setPoints("");
                    // setRemarks("");
                    setSelectedProductName("");
                    setFilteredSKUs([]);
                    setPoints("");
                    setRemarks("");
                    setExpiresType("");
                    setExpiresAfter("");
                    setCreditAfter("");
                    setCreditType("");
                }
            }

            // setOpenCoupon(false);
            // setIsEditing(false);
            // getAllpointRetailCoupon("retail_coupon");
        } catch (error) {
            console.error(
                "Error calling the API:",
                error?.response?.data?.message || error.message
            );
        }
    };

    const formContentCoupon = (
        <div className="flex justify-center items-center ">
            <div className="rounded-lg p-6 w-96">
                <form onSubmit={onSubmitCoupon} className="space-y-4">
                    <div className="flex space-x-2">
                        {/* {/ Product Name Container /} */}
                        <div className="flex flex-col w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name:
                            </label>
                            <select
                                // disabled={isEditing}
                                name="productName"
                                value={selectedProductName}
                                required
                                onChange={handleProductNameChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Name</option>
                                {fetchShopifyProducts?.map((product) => (
                                    <option key={product.id} value={product.title}>
                                        {product.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* {/ SKU Container /} */}
                        <div className="flex flex-col w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU:
                            </label>
                            <select
                                // disabled={isEditing}
                                name="productSKU"
                                value={selectedSKU}
                                required
                                onChange={handleSKUChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {filteredSKUs.map((variant) => (
                                    <option key={variant.id} value={variant.sku}>
                                        {variant.sku}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points Expiry:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="expiresAfter"
                                value={expiresAfter}
                                required
                                // onChange={(e) => setExpiresAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setExpiresAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="expiresType"
                                value={expiresType}
                                required
                                onChange={(e) => setExpiresType(e.target.value)}
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
                            Points Based on Product MRP
                        </label>
                        <input
                            type="number"
                            name="points"
                            value={points}
                            required
                            // onChange={handlePointsChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter points"
                            onChange={(e) => {
                                const value = e.target.value; // Get the raw input value
                                if (value === "" || parseFloat(value) >= 0) {
                                    // Allow only non-negative numbers or an empty value
                                    handlePointsChange(e); // Call the existing handler for valid inputs
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Notes
                        </label>
                        <input
                            type="text"
                            required
                            name="remarks"
                            value={remarks}
                            onChange={handleRemarksChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Notes"
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
                                required
                                value={creditAfter}
                                // onChange={(e) => setCreditAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setCreditAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="creditType"
                                value={creditType}
                                required
                                onChange={(e) => setCreditType(e.target.value)}
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
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isEditing ? <> {loading ? 'Loading...' : 'Update'}</> : <> {loading ? 'Loading...' : 'Submit'}</>}

                    </button>
                </form>
            </div>
        </div>
    );

    const onSubmitBonus = async (e) => {
        setLoading(true)
        e.preventDefault();
        // let counter = 0;
        const formDataCreat = {
            id: pointsListNew?.id,
            type: "bonus_point",
            newValue: {
                ...formDataBonus,
                // value_id: counter += 1,
                expiresAfter: expiresAfter,
                expiresType: expiresType,
                creditAfter: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };
        const formDataUpdate = {
            id: pointsListNew?.id,
            type: "bonus_point",
            newValue: {
                ...formDataBonus,
                value_id: bonusId,
                expiresAfter: expiresAfter,
                expiresType: expiresType,
                creditAfter: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };

        if (isEditing) {
            // Update logic
            const response = await apiCallLocal(
                '/points/updateValue',
                "post",
                formDataUpdate
            );
            if (response.status === 200) {
                setIsEditing(false);
                setLoading(false)
                showPopup("success", "Update successfully!");
                getAllpointslist()
                setOpenBonus(false)

                setPointsListNew(null);
                setFormDataBonus({});
                setBonusId(null);
                setExpiresAfter("");
                setExpiresType("");
                setCreditAfter("");
                setCreditType("");
            }
        } else {
            // Add logic
            const response = await apiCallLocal("/points/addValue", "POST", formDataCreat);
            if (response.status === 200) {
                showPopup("success", "Created successfully!");
                getAllpointslist()
                setOpenBonus(false)
                setLoading(false)
                // setSelectedProductName("");
                // setSelectedSKU("");
                // setPoints("");
                // setRemarks("");
                setPointsListNew(null);
                setFormDataBonus({});
                setBonusId(null);
                setExpiresAfter("");
                setExpiresType("");
                setCreditAfter("");
                setCreditType("");
            }
        }
    };

    const formContentBonus = (
        <div className="flex justify-center items-center ">
            <div className="rounded-lg p-6 w-96">
                <form onSubmit={onSubmitBonus} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            // disabled={isEditing}
                            name="category"
                            required
                            value={formDataBonus.category}
                            onChange={handleChangeBonus}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                        >
                            {fetchCategory?.map((product) => (
                                <option key={product.id} value={product.handle}>{product.title} </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Purchase Value:
                        </label>
                        <input
                            type="number"
                            name="purchaseValue"
                            required
                            value={formDataBonus.purchaseValue}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value); // Convert the input value to a number
                                if (value >= 0 || e.target.value === "") { // Allow only non-negative numbers or empty input
                                    handleChangeBonus(e); // Call the existing change handler for valid values
                                }
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter purchase value"
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
                                required
                                value={expiresAfter}
                                onChange={(e) => setExpiresAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                            />
                            <select
                                name="expiresType"
                                value={expiresType}
                                required
                                onChange={(e) => setExpiresType(e.target.value)}
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
                            Product Name:
                        </label>
                        <select
                            name="productName"
                            value={formDataBonus.productName}
                            required
                            onChange={handleChangeBonus}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        // disabled={isEditing}
                        >
                            <option value="">Select Name</option>
                            {fetchShopifyProducts?.map((product) => (
                                <option key={product.id} value={product.title}>
                                    {product.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points:
                        </label>
                        <input
                            type="text"
                            name="points"
                            required
                            value={formDataBonus.points}
                            onChange={handleChangeBonus}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter points"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks :
                        </label>
                        <input
                            type="text"
                            name="remarks"
                            value={formDataBonus.remarks}
                            onChange={handleChangeBonus}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Notes"
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
                                required
                                value={creditAfter}
                                onChange={(e) => setCreditAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                            />
                            <select
                                name="creditType"
                                required
                                value={creditType}
                                onChange={(e) => setCreditType(e.target.value)}
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
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isEditing ? <> {loading ? 'Loading...' : 'Update'}</> : <> {loading ? 'Loading...' : 'Submit'}</>}

                    </button>
                </form>
            </div>
        </div>
    );

    const handleEditCategory = (value_id) => {
        // Find the row data based on value_id
        const selectedData = pointsListNew?.point_conversion_based_on_category?.value.find(
            (item) => item.value_id === value_id
        );

        // Set form data if the data exists
        if (selectedData) {
            setFormDataCategory({
                category: selectedData.category,
                points: selectedData.points,
                remarks: selectedData.remarks,
            });
            setExpiresAfter(selectedData.expiresAfter);
            setExpiresType(selectedData.expiresType);
            setCreditAfter(selectedData.creditAfter);
            setCreditType(selectedData.creditType);

            setIsEditing(true); // Set editing mode
            setOpenCategorie(true); // Open the modal
            setCategorieId(value_id)
        }
    };

    const onSubmitCategory = async (e) => {

        setLoading(true)
        e.preventDefault();
        // let counter = 0;
        const formDataCreat = {
            id: pointsListNew?.id,
            type: "point_conversion_based_on_category",
            newValue: {
                ...formDataCategory,
                // value_id: counter += 1,
                expiresAfter: expiresAfter,
                expiresType: expiresType,
                credit_after_days: creditAfter,
                expiresOn: `${expiresAfter} ${expiresType}`,
                creditAfter: creditAfter,
                creditType: creditType,
                remarks: formDataCategory.remarks,
                points: formDataCategory.points,
                ruleType: "category",
                category: formDataCategory?.category || fetchCategory?.[0]?.handle,
                // store:selectedValue
            }
        };

        const formDataUpdate = {
            id: pointsListNew?.id,
            type: "point_conversion_based_on_category",
            newValue: {
                ...formDataCategory,
                value_id: CategorieId,
                expiresAfter: expiresAfter,
                expiresType: expiresType,
                credit_after_days: creditAfter,
                creditAfter: creditAfter,
                creditType: creditType,
                remarks: formDataCategory.remarks,
                points: formDataCategory.points,
                expiresOn: `${expiresAfter} ${expiresType}`,
                ruleType: "category",
                category: formDataCategory.category,
                // store:selectedValue
            }
        };

        // Add logic
        if (isEditing) {
            const response = await apiCallLocal(
                '/points/updateValue',
                "post",
                formDataUpdate
            );
            if (response.status === 200) {
                setLoading(false)
                showPopup("success", "Created successfully!");
                getAllpointslist()
                setOpenCategorie(false)

                setFormDataCategory({})
                setExpiresType("");
                setExpiresAfter("");
                setCreditAfter("");
                setCreditType("");

            }
        } else {
            // Add logic
            const response = await apiCallLocal(
                "/points/addValue",
                "POST",
                formDataCreat
            );
            if (response.status === 200) {
                setLoading(false)
                showPopup("success", "Created successfully!");
                getAllpointslist()
                setOpenCategorie(false)

                setFormDataCategory({})
                setExpiresType("");
                setExpiresAfter("");
                setCreditAfter("");
                setCreditType("");

            }
        }
    };

    const formContentCategory = (
        <div className="flex justify-center items-center ">
            <div className="rounded-lg p-6 w-96">
                <form onSubmit={onSubmitCategory} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            // disabled={isEditing}
                            required
                            name="category"
                            value={formDataCategory?.category}
                            onChange={handleChangeCategory}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                        >
                            <option> Select</option>
                            {fetchCategory?.map((product) => (
                                <option key={product?.id} value={product?.handle}>
                                    {product?.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Credit After:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                required
                                name="creditAfter"
                                value={creditAfter}
                                // onChange={(e) => setCreditAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setCreditAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="creditType"
                                value={creditType}
                                required
                                onChange={(e) => setCreditType(e.target.value)}
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
                            Points:
                        </label>
                        <input
                            type="number"
                            name="points"
                            required
                            value={formDataCategory.points}
                            // onChange={handleChangeCategory}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter points"
                            onChange={(e) => {
                                const value = e.target.value; // Get the raw input value
                                if (value === "" || parseFloat(value) >= 0) {
                                    // Allow only non-negative numbers or an empty value
                                    handleChangeCategory(e); // Call the existing handler for valid inputs
                                }
                            }}

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
                                required
                                value={expiresAfter}
                                // onChange={(e) => setExpiresAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setExpiresAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}

                            />
                            <select
                                name="expiresType"
                                required
                                value={expiresType}
                                onChange={(e) => setExpiresType(e.target.value)}
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
                            Additional Notes:
                        </label>
                        <input
                            type="text"
                            name="remarks"
                            value={formDataCategory.remarks}
                            required
                            onChange={handleChangeCategory}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Notes"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isEditing ? <> {loading ? 'Loading...' : 'Update'}</> : <> {loading ? 'Loading...' : 'Submit'}</>}

                    </button>
                </form>
            </div>
        </div>
    );

    const handleEditOffline = (valueId) => {
        // Fetch the specific data based on valueId (e.g., by filtering `pointsListNew`)
        const dataToEdit = pointsListNew?.twox_reward_offline?.value.find(item => item.value_id === valueId);

        if (dataToEdit) {
            
            setSelectedProductName(dataToEdit?.productName)
            // setSelectedSKU(dataToEdit?.skuNo);
            setCreditType(dataToEdit?.creditType)
            setCreditAfter(dataToEdit?.creditAfter)
            setExpiresType(dataToEdit?.expiresType)
            setExpiresAfter(dataToEdit?.expiresAfter)
            setRemarks(dataToEdit?.remarks)
            setPoints(dataToEdit?.points)

            setFilteredSKUs([{ "sku": dataToEdit?.product_sku }])
            // setIsEditing(!isEditing)

            setIsEditing(true);
            setOpenCOD(true);
            setOfflineId(valueId)
        }
    };

    const onSubmitPayWithRewards = async (e) => {
        e.preventDefault();
        setLoading(true)
        // let counter = 0;
        const formDataCreat = {
            id: pointsListNew?.id,
            type: "twox_reward_offline",
            newValue: {
                // value_id: counter += 1,
                product_title: selectedProduct?.title,
                product_id: selectedProduct?.id,
                productName: selectedProductName,
                product_sku: filteredSKUs[0]?.sku,
                points: points,
                remarks: remarks,
                expiresType: expiresType,
                expiresOn: `${expiresAfter} ${expiresType}`,
                expiresAfter: expiresAfter,
                creditAfter: creditAfter,
                credit_after_days: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };


        const formDataUpdate = {
            id: pointsListNew?.id,
            type: "twox_reward_offline",
            newValue: {
                value_id: offlineId,
                skuNo: filteredSKUs[0]?.sku,
                product_title: selectedProduct?.title,
                product_id: selectedProduct?.id,
                productName: selectedProductName,
                product_sku: filteredSKUs[0]?.sku,
                points: points,
                remarks: remarks,
                expiresType: expiresType,
                expiresOn: `${expiresAfter} ${expiresType}`,
                expiresAfter: expiresAfter,
                creditAfter: creditAfter,
                credit_after_days: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };
        // Add logic
        if (isEditing) {
            const response = await apiCallLocal(
                '/points/updateValue',
                "post",
                formDataUpdate
            );
            if (response.status === 200) {
                showPopup("success", "update successfully!");
                getAllpointslist()
                setOpenCOD(false)
                setLoading(false)
            }
        } else {
            // Add logic
            const response = await apiCallLocal(
                "/points/addValue",
                "POST",
                formDataCreat
            );
            if (response.status === 200) {
                setLoading(false)
                showPopup("success", "Created successfully!");
                getAllpointslist()
                setOpenCOD(false)

                setSelectedProductName("");
                setFilteredSKUs([]);
                setPoints("");
                setRemarks("");
                setExpiresType("");
                setExpiresAfter("");
                setCreditAfter("");
                setCreditType("");
            }
        }


    };

    const formContentCOD = (
        <div className="flex justify-center items-center">
            <div className="rounded-lg p-6 w-96">

                <form
                    onSubmit={onSubmitPayWithRewards}
                    className="space-y-4"
                >
                    <div className="flex space-x-2">
                        {/* {/ Product Name Section /} */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name:
                            </label>
                            <select
                                // disabled={isEditing}
                                required
                                name="productName"
                                value={selectedProductName}
                                onChange={handleProductNameChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Name</option>
                                {fetchShopifyProducts?.map((product) => (
                                    <option key={product.id} value={product.title}>
                                        {product.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* {/ SKU Section /} */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU:
                            </label>
                            <select
                                // disabled={isEditing}
                                required
                                name="productSKU"
                                value={selectedSKU}
                                onChange={handleSKUChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {filteredSKUs.map((variant) => (
                                    <option key={variant.id} value={variant.sku}>
                                        {variant.sku}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points Expiry:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="expiresAfter"
                                required
                                value={expiresAfter}
                                // onChange={(e) => setExpiresAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setExpiresAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="expiresType"
                                value={expiresType}
                                required
                                onChange={(e) => setExpiresType(e.target.value)}
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
                            Points
                        </label>
                        <input
                            type="number"
                            name="points"
                            required
                            value={points}
                            // onChange={handlePointsChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter points"
                            onChange={(e) => {
                                const value = e.target.value; // Get the raw input value
                                if (value === "" || parseFloat(value) >= 0) {
                                    // Allow only non-negative numbers or an empty value
                                    handlePointsChange(e); // Call the existing handler for valid inputs
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Note
                        </label>
                        <input
                            type="text"
                            name="remarks"
                            value={remarks}
                            required
                            onChange={handleRemarksChange}
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
                                required
                                name="creditAfter"
                                value={creditAfter}
                                // onChange={(e) => setCreditAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setCreditAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}

                            />
                            <select
                                name="creditType"
                                required
                                value={creditType}
                                onChange={(e) => setCreditType(e.target.value)}
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

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isEditing ? <> {loading ? 'Loading...' : 'Update'}</> : <> {loading ? 'Loading...' : 'Submit'}</>}

                    </button>
                </form>
            </div>
        </div>
    );

    const onSubmitPayWithRewardsOnline = async (e) => {
        e.preventDefault();
        setLoading(true)
        // let counter = 0;
        const formDataCreat = {
            id: pointsListNew?.id,
            type: "twox_reward_online",
            newValue: {
                // value_id: counter += 1,
                product_title: selectedProduct?.title,
                product_id: selectedProduct?.id,
                productName: selectedProductName,
                product_sku: filteredSKUs[0]?.sku,
                points: points,
                remarks: remarks,
                expiresType: expiresType,
                expiresOn: `${expiresAfter} ${expiresType}`,
                expiresAfter: expiresAfter,
                creditAfter: creditAfter,
                credit_after_days: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };

        const formDataUpdate = {
            id: pointsListNew?.id,
            type: "twox_reward_online",
            newValue: {
                value_id: OnlineId,
                productName: selectedProductName,
                product_title: selectedProduct?.title,
                product_id: selectedProduct?.id,
                product_sku: filteredSKUs[0]?.sku,
                points: points,
                remarks: remarks,
                expiresType: expiresType,
                expiresOn: `${expiresAfter} ${expiresType}`,
                expiresAfter: expiresAfter,
                creditAfter: creditAfter,
                credit_after_days: creditAfter,
                creditType: creditType,
                // store:selectedValue
            }
        };
        // Add logic
        if (isEditing) {
            const response = await apiCallLocal(
                '/points/updateValue',
                "post",
                formDataUpdate
            );
            if (response.status === 200) {
                showPopup("success", "Created successfully!");
                getAllpointslist()
                setLoading(false)
                setOpenOnlineRewards(false)

                setSelectedProductName("");
                setFilteredSKUs([]);
                setPoints("");
                setRemarks("");
                setExpiresType("");
                setExpiresAfter("");
                setCreditAfter("");
                setCreditType("");
            }
        } else {
            // Add logic
            const response = await apiCallLocal(
                "/points/addValue",
                "POST",
                formDataCreat
            );
            if (response.status === 200) {
                showPopup("success", "Created successfully!");
                getAllpointslist()
                setLoading(false)
                setOpenOnlineRewards(false),

                    setSelectedProductName("");
                setFilteredSKUs([]);
                setPoints("");
                setRemarks("");
                setExpiresType("");
                setExpiresAfter("");
                setCreditAfter("");
                setCreditType("");
            }
        }
    }
    const formContentOnlineRewards = (
        <div className="flex justify-center items-center">
            <div className="rounded-lg p-6 w-96">
                <form
                    onSubmit={onSubmitPayWithRewardsOnline}
                    className="space-y-4"
                >
                    <div className="flex space-x-2">
                        {/* {/ Product Name Section /} */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name:
                            </label>
                            <select
                                // disabled={isEditing}
                                required
                                name="productName"
                                value={selectedProductName}
                                onChange={handleProductNameChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Name</option>
                                {fetchShopifyProducts?.map((product) => (
                                    <option key={product.id} value={product.title}>
                                        {product.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* {/ SKU Section /} */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU:
                            </label>
                            <select
                                // disabled={isEditing}
                                name="productSKU"
                                value={selectedSKU}
                                onChange={handleSKUChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {filteredSKUs.map((variant) => (
                                    <option key={variant.id} value={variant.sku}>
                                        {variant.sku}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points Expiry:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="expiresAfter"
                                value={expiresAfter}
                                required
                                // onChange={(e) => setExpiresAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setExpiresAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="expiresType"
                                value={expiresType}
                                required
                                onChange={(e) => setExpiresType(e.target.value)}
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
                            Points
                        </label>
                        <input
                            type="number"
                            name="points"
                            value={points}
                            required
                            // onChange={handlePointsChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter points"
                            onChange={(e) => {
                                const value = e.target.value; // Get the raw input value
                                if (value === "" || parseFloat(value) >= 0) {
                                    // Allow only non-negative numbers or an empty value
                                    handlePointsChange(e); // Call the existing handler for valid inputs
                                }
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Note
                        </label>
                        <input
                            type="text"
                            name="remarks"
                            required
                            value={remarks}
                            onChange={handleRemarksChange}
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
                                required
                                value={creditAfter}
                                // onChange={(e) => setCreditAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setCreditAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="creditType"
                                value={creditType}
                                required
                                onChange={(e) => setCreditType(e.target.value)}
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

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isEditing ? <> {loading ? 'Loading...' : 'Update'}</> : <> {loading ? 'Loading...' : 'Submit'}</>}

                    </button>
                </form>
            </div>
        </div>
    );

    const handleSaveRegistration = async (e) => {
        e.preventDefault();
        setShowLoader(true)
        setLoading(true)


        const currentDate = new Date();

        // Calculate the expiry date
        let expiryDate;
        if (expiresType === "days") {
            expiryDate = new Date(currentDate);
            expiryDate.setDate(expiryDate.getDate() + parseInt(expiresAfter, 10));
        } else if (expiresType === "months") {
            expiryDate = new Date(currentDate);
            expiryDate.setMonth(expiryDate.getMonth() + parseInt(expiresAfter, 10));
        }

        // Calculate the credit date
        let creditTotalDays = 0;
        if (creditType === "days") {
            creditTotalDays = parseInt(creditAfter, 10); // Already in days
        } else if (creditType === "months") {
            const startDate = new Date(currentDate);
            for (let i = 0; i < parseInt(creditAfter, 10); i++) {
                // Add one month at a time and calculate days in that month
                const monthDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
                creditTotalDays += monthDays;
                startDate.setMonth(startDate.getMonth() + 1); // Move to the next month
            }
        }




        // Format the dates (optional)
        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
            const year = date.getFullYear();
            return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
        };

        const formattedExpiryDate = formatDate(expiryDate);

        const formDataCreat = {
            id: selectedValue == 'rajnigandha' ? 1 : 2,
            point: points,
            // credit_day
            remarks: Registrationremarks,
            expiry_date: formattedExpiryDate,

            expiry_day: `${expiresAfter} ${expiresType}`,

            credit_after: creditTotalDays,
            credit_day: `${creditAfter} ${creditType}`,
            store: selectedValue
            // expiry_day expiry_day credit_day
        };


        try {
            const response = await apiCallLocal('/points/createOrUpdateRegistration', "post",
                formDataCreat
            );
            if (response.status === 200) {
                handleGetRegistration()
                setLoading(false)
                setShowLoader(false)
                setOpenRegistration(false);
                showPopup("success", "Updated successfully!");

            }
        } catch (error) {
            setLoading(false)
            setShowLoader(false)
            setOpenRegistration(false);
            console.error("Error saving registration points:", error);
        }

    };

    const formContentRegistration = (
        <div className="flex justify-center items-center">
            <div className="rounded-lg p-6 w-96">
                <form
                    onSubmit={handleSaveRegistration}
                    className="space-y-4"
                >

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points Expiry:
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="expiresAfter"
                                value={expiresAfter}
                                required
                                // onChange={(e) => setExpiresAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setExpiresAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="expiresType"
                                value={expiresType}
                                required
                                onChange={(e) => setExpiresType(e.target.value)}
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
                            Points
                        </label>
                        <input
                            type="number"
                            name="points"
                            value={points}
                            required
                            // onChange={handlePointsChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter points"
                            onChange={(e) => {
                                const value = e.target.value; // Get the raw input value
                                if (value === "" || parseFloat(value) >= 0) {
                                    // Allow only non-negative numbers or an empty value
                                    handlePointsChange(e); // Call the existing handler for valid inputs
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks:
                        </label>
                        <input
                            type="text"
                            name="Registrationremarks"
                            required
                            value={Registrationremarks}
                            onChange={(e) => setRegistrationRemarks(e.target.value)}
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
                                required
                                value={creditAfter}
                                // onChange={(e) => setCreditAfter(e.target.value)}
                                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter number"
                                onChange={(e) => {
                                    const value = e.target.value; // Get the raw input value
                                    if (value === "" || parseFloat(value) >= 0) {
                                        // Allow only non-negative numbers or an empty value
                                        setCreditAfter(e.target.value); // Call the existing handler for valid inputs
                                    }
                                }}
                            />
                            <select
                                name="creditType"
                                value={creditType}
                                required
                                onChange={(e) => setCreditType(e.target.value)}
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

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isEditing ? <> {loading ? 'Loading...' : 'Update'}</> : <> {loading ? 'Loading...' : 'Submit'}</>}

                    </button>
                </form>
            </div>
        </div>
    );

    const handleToggle = async (ruleKey, checked) => {
        if (!ruleKey || typeof checked === 'undefined') {
            console.error("Invalid arguments passed to handleToggle");
            return;
        }

        // Update the statuses: activate only the selected key and deactivate others
        const updatedData = {
            ...pointsListNew,
            store: selectedValue,
            point_conversion_online_purchase: {
                ...pointsListNew.point_conversion_online_purchase,
                status: ruleKey === "point_conversion_online_purchase" && checked ? "active" : "inactive",
            },
            point_conversion_based_on_sku: {
                ...pointsListNew.point_conversion_based_on_sku,
                status: ruleKey === "point_conversion_based_on_sku" && checked ? "active" : "inactive",
            },
            point_conversion_based_on_category: {
                ...pointsListNew.point_conversion_based_on_category,
                status: ruleKey === "point_conversion_based_on_category" && checked ? "active" : "inactive",
            },
            [ruleKey]: { ...pointsListNew[ruleKey], status: checked ? "active" : "inactive" }
        };


        setPointsListNew(updatedData); // Update local state

        try {
            const response = await apiCallLocal(
                '/points/addOrUpdateRuleSet',
                "post",
                updatedData
            );
            if (response.status === 200) {
                showPopup(`${checked ? "success" : "error"}`, `${checked ? "Active" : "Inactive"} Successfully!`);
                getAllpointslist();
            }
        } catch (error) {
            console.error("Error calling API:", error);
        }
    };

    const handleGetRegistration = async () => {

        try {
            const response = await apiCallLocal(`/points/getRegistrationPoint?store=${selectedValue}`, "get",

            );
            if (response.status === 200) {
                 setRegistration(response.data[0])
               
            }

        } catch (error) {
            console.error("Error saving registration points:", error);
        }
    };

    // 
    const data = {};
    const permission = (data) => {
        if (data == "read") {
            showPopup('warning', msg.readOnly)
        }
    }
    return (
        <div className="w-full mx-auto shadow-md">
            {showLoader && <LoaderSpiner text="Loading ..." />}
            <CustomModal
                open={open}
                handleClose={handleClose}
                description={formContent}
            />
            <CustomModal
                open={opensku}
                handleClose={handleClosesku}
                description={formContentsku}
            />
            <CustomModal
                open={openCoupon}
                handleClose={handleCloseCoupon}
                description={formContentCoupon}
            />

            <CustomModal
                open={openBonus}
                handleClose={handleCloseBonus}
                description={formContentBonus}
            />
            <CustomModal
                open={openCategorie}
                handleClose={handleCloseCategory}
                description={formContentCategory}
            />

            <CustomModal
                open={openCOD}
                handleClose={handleCloseCOD}
                description={formContentCOD}
            />
            <CustomModal
                open={openOnlineRewards}
                handleClose={handleCloseOnlineRewards}
                description={formContentOnlineRewards}
            />
            <CustomModal
                open={openRegistration}
                handleClose={handleCloseRegistration}
                description={formContentRegistration}
            />

            {/* ----------------------------ecommerce----------------------- */}
            <div className="w-[95%] mx-auto p-8 mt-5 shadow-md">
                <h1 className="text-2x1 font-bold mb-4 text-blue-600">Ecommerce</h1>
                 <div className=" items-center">
                    {/* On-Line Purchase Section */}
                    <div className="w-full mx-auto p-8 shadow-md">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 w-full">
                                <h1 className="text-lg font-bold">
                                    Points Conversion - On-Line Purchase
                                </h1>
                                <label className="relative inline-flex items-center cursor-pointer">

                                    {data?.role_permissions?.Rule_Set?.update ? <>
                                        <input
                                            type="checkbox"
                                            name="switch1"
                                            checked={pointsListNew?.point_conversion_online_purchase?.status === "active"}
                                            className="sr-only peer"
                                            onChange={(e) =>
                                                handleToggle("point_conversion_online_purchase", e.target.checked)
                                            }
                                        />
                                    </> : <>
                                        <input
                                            type="checkbox"
                                            name="switch1"
                                            checked={pointsListNew?.point_conversion_online_purchase?.status === "active"}
                                            className="sr-only peer"
                                            onChange={(e) =>
                                                permission('read')
                                            }
                                        />
                                    </>}
                                    <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                                    <div
                                        className={`absolute left-0 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${pointsListNew?.point_conversion_online_purchase?.status === "active" ? "translate-x-4" : "translate-x-0"
                                            }`}
                                    ></div>
                                </label>
                            </div>

                            {data?.role_permissions?.Rule_Set?.update?<>
                                <button
                                    className={`px-4 py-2 rounded-md ml-2 ${pointsListNew?.point_conversion_online_purchase?.value && Object.keys(pointsListNew?.point_conversion_online_purchase?.value).length > 0
                                        ? "bg-gray-400 text-white-500 cursor-not-allowed"
                                        : "bg-blue-500 text-white"
                                        }`}
                                    onClick={handleOpen}
                                    disabled={pointsListNew?.point_conversion_online_purchase?.value && Object.keys(pointsListNew?.point_conversion_online_purchase.value).length > 0}
                                >
                                    Add
                                </button>
                            </> : <>
                                <button
                                    className={`px-4 py-2 rounded-md ml-2 ${pointsListNew?.point_conversion_online_purchase?.value && Object.keys(pointsListNew?.point_conversion_online_purchase?.value).length > 0
                                        ? "bg-gray-400 text-white-500 cursor-not-allowed"
                                        : "bg-blue-500 text-white"
                                        }`}
                                    onClick={() => permission('read')}
                                    disabled={pointsListNew?.point_conversion_online_purchase?.value && Object.keys(pointsListNew?.point_conversion_online_purchase.value).length > 0}
                                >
                                    Add
                                </button>
                            </>}
                        </div>
                        <div className="max-h-[278px] min-h-auto overflow-y-auto">
                            {pointsListNew?.point_conversion_online_purchase?.status == "active" ? <>
                                <table className="w-full border-collapse border border-gray-300 mt-4">
                                    <thead>
                                        <tr className="bg-gray-200 text-left">
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
                                            </td>
                                            <td className="p-2 border border-gray-300">
                                                {pointsListNew?.point_conversion_online_purchase?.value[0]?.remarks ?? "N/A"}
                                            </td>
                                            <td className="p-2 border border-gray-300">
                                                {pointsListNew?.point_conversion_online_purchase?.value[0]?.created_by ?? "Super Admin"}
                                            </td>
                                            <td className="p-2 border border-gray-300">
                                                {data?.role_permissions?.Rule_Set?.update ? <>

                                                    <button
                                                        className="mr-4 text-[#178eba]"
                                                        onClick={() => editById(pointsListNew?.point_conversion_online_purchase?.value[0]?.value_id)}
                                                    >
                                                        <i className="fas fa-pen"></i>
                                                    </button>
                                                </> : <>
                                                    <button
                                                        className="mr-4 text-[#178eba]"
                                                        onClick={() => permission('read')}
                                                    >
                                                        <i className="fas fa-pen"></i>
                                                    </button>
                                                </>}

                                                {data?.role_permissions?.Rule_Set?.delete ? <>

                                                    <button
                                                        className="text-red-500"
                                                        onClick={() => handleDelete(pointsListNew)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </> : <>
                                                    <button
                                                        className="text-red-500"
                                                        onClick={() => permission('read')}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </>}
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                            </> : <></>}
                        </div>
                    </div>

                    {selectedValue == 'rajnigandha' ? <>



                        {/* SKU (Product-specific) Section */}
                        <div className="max-w-6xl mx-auto p-8 shadow-md mt-8">

                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4 w-full">
                                    <h1 className="text-lg font-bold">
                                        Points Conversion Based on SKU (Product-specific)
                                    </h1>
                                    <div >
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            {data?.role_permissions?.Rule_Set?.update ? <>
                                                <input
                                                    type="checkbox"
                                                    name="switch2"
                                                    checked={pointsListNew?.point_conversion_based_on_sku?.status === "active"}
                                                    className="sr-only peer"
                                                    onChange={(e) =>
                                                        handleToggle("point_conversion_based_on_sku", e.target.checked)
                                                    }
                                                />
                                            </> : <>
                                                <input
                                                    type="checkbox"
                                                    name="switch2"
                                                    checked={pointsListNew?.point_conversion_based_on_sku?.status === "active"}
                                                    className="sr-only peer"
                                                    onChange={(e) =>
                                                        permission('read')
                                                    }
                                                />
                                            </>}
                                            <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                                            <div
                                                className={`absolute left-0 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${pointsListNew?.point_conversion_based_on_sku?.status === "active" ? "translate-x-4" : "translate-x-0"
                                                    }`}
                                            ></div>
                                        </label>
                                    </div>
                                </div>
                                 {data?.role_permissions?.Rule_Set?.update ? <>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
                                        onClick={handleOpenSKU}
                                    >
                                        Add
                                    </button>
                                </> : <>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
                                        onClick={(e) => permission('read')}
                                    >
                                        Add
                                    </button>
                                </>}
                            </div>
                            <div className="max-h-[278px] min-h-auto overflow-y-auto">
                                {pointsListNew?.point_conversion_based_on_sku?.status == "active" ? <>
                                    <table className="w-full border-collapse border border-gray-300 mt-4">
                                        <thead>
                                            <tr className="bg-gray-200 text-left">
                                                 <th className="p-2 border border-gray-300">Product SKU</th>
                                                <th className="p-2 border border-gray-300">Product Name</th>
                                                <th className="p-2 border border-gray-300">Points</th>
                                                <th className="p-2 border border-gray-300">Point Expiry </th>
                                                <th className="p-2 border border-gray-300">Credit After Duration</th>
                                                <th className="p-2 border border-gray-300">Remarks </th>
                                                <th className="p-2 border border-gray-300">Created By</th>
                                                <th className="p-2 border border-gray-300">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                pointsListNew?.point_conversion_based_on_sku?.value && pointsListNew?.point_conversion_based_on_sku?.value.length > 0 ? (
                                                    pointsListNew?.point_conversion_based_on_sku?.value.map((row, index) => (
                                                        <tr key={index} className="hover:">
                                                            <td className="p-2 border border-gray-300">
                                                                {row.product_sku ?? "N/A"}
                                                            </td>
                                                            <td className="p-2 border border-gray-300">
                                                                {row.productName ?? "N/A"}
                                                            </td>
                                                            <td className="p-2 border border-gray-300">
                                                                {row.points ?? "N/A"}
                                                            </td>
                                                            <td className="p-2 border border-gray-300">
                                                                {row.expiresOn ?? "N/A"}
                                                            </td>
                                                            <td className="p-2 border border-gray-300">
                                                                {row?.creditAfter} &nbsp;{row?.creditType}
                                                            </td>
                                                            <td className="p-2 border border-gray-300">
                                                                {row.remarks ?? "N/A"}
                                                            </td>
                                                            <td className="p-2 border border-gray-300">
                                                                {row.createdBy ?? "Super Admin"}
                                                            </td>
                                                            <td className="p-2 border border-gray-300">
                                                                {data?.role_permissions?.Rule_Set?.update ? <>
                                                                    <button
                                                                        className="mr-4 text-[#178eba]"
                                                                        onClick={() => skuEditById(row?.value_id)}
                                                                    >
                                                                        <i className="fas fa-pen"></i>
                                                                    </button>
                                                                </> : <>
                                                                    <button
                                                                        className="mr-4 text-[#178eba]"
                                                                        onClick={() => permission('read')}
                                                                    >
                                                                        <i className="fas fa-pen"></i>
                                                                    </button>
                                                                </>}
                                                                {data?.role_permissions?.Rule_Set?.delete ? <>

                                                                    <button
                                                                        className="text-red-500"
                                                                        onClick={() => handleDeletesku(row.value_id)}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </> : <>
                                                                    <button
                                                                        className="text-red-500"
                                                                        onClick={() => permission('read')}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </>}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) :
                                                    (
                                                        <tr>
                                                            <td colSpan="8" className="p-4 text-center text-red-500">
                                                                No data available
                                                            </td>
                                                        </tr>
                                                    )}
                                        </tbody>
                                    </table>
                                </> : <></>}
                            </div>
                        </div>


                        {/* Categorie */}
                        <div className="max-w-6xl mx-auto p-8 shadow-md mt-8">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4 w-full">
                                    <h1 className="text-lg font-bold">Category</h1>
                                    <div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            {data?.role_permissions?.Rule_Set?.update ? <>
                                                <input
                                                    type="checkbox"
                                                    name="switch5"
                                                    checked={pointsListNew?.point_conversion_based_on_category?.status === "active"}
                                                    className="sr-only peer"
                                                    onChange={(e) =>
                                                        handleToggle("point_conversion_based_on_category", e.target.checked)
                                                    }
                                                />
                                            </> : <>
                                                <input
                                                    type="checkbox"
                                                    name="switch5"
                                                    checked={pointsListNew?.point_conversion_based_on_category?.status === "active"}
                                                    className="sr-only peer"
                                                    onChange={(e) =>
                                                        permission('read')
                                                    }
                                                />
                                            </>}
                                            <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                                            <div
                                                className={`absolute left-0 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${pointsListNew?.point_conversion_based_on_category?.status === "active" ? "translate-x-4" : "translate-x-0"
                                                    }`}
                                            ></div>
                                        </label>
                                    </div>
                                </div>
                                {data?.role_permissions?.Rule_Set?.update ? <>

                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
                                        onClick={() => handleOpenCategorie(false)}
                                    >
                                        Add
                                    </button>
                                </> : <>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
                                        onClick={(e) => permission('read')}
                                    >
                                        Add
                                    </button>
                                </>}
                            </div>
                            <div className="max-h-[278px] min-h-auto overflow-y-auto">
                                {pointsListNew?.point_conversion_based_on_category?.status == 'active' ? <>
                                    <table className="w-full border-collapse border border-gray-300 mt-4">
                                        <thead>
                                            <tr className="bg-gray-200 text-left">
                                                {/* <th className="p-2 border border-gray-300">Status</th> */}
                                                <th className="p-2 border border-gray-300">Category</th>
                                                <th className="p-2 border border-gray-300">Points</th>
                                                <th className="p-2 border border-gray-300">Point Expiry </th>
                                                <th className="p-2 border border-gray-300">Credit After Duration</th>
                                                <th className="p-2 border border-gray-300">Remarks </th>
                                                <th className="p-2 border border-gray-300">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pointsListNew?.point_conversion_based_on_category?.value && pointsListNew?.point_conversion_based_on_category?.value?.length > 0 ? (
                                                pointsListNew?.point_conversion_based_on_category?.value.map((row, index) => (
                                                    <tr key={index} className="hover:">


                                                        <td className="p-2 border border-gray-300">
                                                            {row?.category ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.points ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.expiresAfter ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.creditAfter} &nbsp;{row?.creditType}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.remarks ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {data?.role_permissions?.Rule_Set?.update ? <>

                                                                <button
                                                                    className="mr-4 text-[#178eba]"
                                                                    onClick={() => handleEditCategory(row?.value_id)}
                                                                >
                                                                    <i className="fas fa-pen"></i>
                                                                </button>
                                                            </> : <>
                                                                <button
                                                                    className="mr-4 text-[#178eba]"
                                                                    onClick={() => permission('read')}
                                                                >
                                                                    <i className="fas fa-pen"></i>
                                                                </button>
                                                            </>}
                                                            {data?.role_permissions?.Rule_Set?.delete ? <>
                                                                <button
                                                                    className="text-red-500"
                                                                    onClick={() => handleDeleteskuCategory(row?.value_id)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </> : <>
                                                                <button
                                                                    className="text-red-500"
                                                                    onClick={() => permission('read')}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </>}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="p-4 text-center text-red-500">
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </> : <></>}
                            </div>
                        </div>
                    </> : <></>}
                </div>
            </div>
            {/* -------------------------------------rewards---------------- */}
            {selectedValue == 'rajnigandha' ? <>
                <div className="w-[95%] mx-auto p-8 mt-5 shadow-md">
                    <h1 className="text-2x1 font-bold text-blue-600">Subscription</h1>
                    {/* Pay with rewards */}
                    <div className="max-w-6xl mx-auto p-8 shadow-md mt-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 w-full">
                                <h1 className="text-lg font-bold">2x reward subscription(COD)</h1>
                                <div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        {data?.role_permissions?.Rule_Set?.update ? <>

                                            <input
                                                type="checkbox"
                                                name="switch6"
                                                checked={pointsListNew?.twox_reward_offline?.status === "active"}
                                                className="sr-only peer"
                                                onChange={(e) =>
                                                    handleToggle("twox_reward_offline", e.target.checked)
                                                }
                                            />
                                        </> : <>
                                            <input
                                                type="checkbox"
                                                name="switch6"
                                                checked={pointsListNew?.twox_reward_offline?.status === "active"}
                                                className="sr-only peer"
                                                onChange={(e) =>
                                                    permission('read')
                                                }
                                            />
                                        </>}
                                        <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                                        <div
                                            className={`absolute left-0 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${pointsListNew?.twox_reward_offline?.status === "active" ? "translate-x-4" : "translate-x-0"
                                                }`}
                                        ></div>
                                    </label>
                                </div>
                            </div>
                            {data?.role_permissions?.Rule_Set?.update ? <>

                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"

                                    onClick={() => handleOpenCOD(false)}
                                >
                                    Add
                                </button>
                            </> : <>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"

                                    onClick={() => permission('read')}
                                >
                                    Add
                                </button>
                            </>}
                        </div>
                        <div className="max-h-[278px] min-h-auto overflow-y-auto">
                            {pointsListNew?.twox_reward_offline?.status == 'active' ? <>
                                <table className="w-full border-collapse border border-gray-300 mt-4">
                                    <thead>
                                        <tr className="bg-gray-200 text-left">
                                            {/* <th className="p-2 border border-gray-300">Status</th> */}
                                            <th className="p-2 border border-gray-300">Product SKU</th>
                                            <th className="p-2 border border-gray-300">Product Name</th>
                                            <th className="p-2 border border-gray-300">Points</th>
                                            <th className="p-2 border border-gray-300">Point Expiry </th>
                                            <th className="p-2 border border-gray-300"> Credit After Duration</th>
                                            <th className="p-2 border border-gray-300">Remarks </th>
                                            <th className="p-2 border border-gray-300">Created By</th>
                                            <th className="p-2 border border-gray-300">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            pointsListNew?.twox_reward_offline?.value && pointsListNew?.twox_reward_offline?.value.length > 0 ? (
                                                pointsListNew?.twox_reward_offline?.value.map((row, index) => (
                                                    <tr key={index} className="hover:">

                                                        <td className="p-2 border border-gray-300">
                                                            {row?.product_sku ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.productName ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.points ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.expiresOn ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.creditAfter} &nbsp;{row?.creditType}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.remarks ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row.createdBy ?? "Super Admin"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {data?.role_permissions?.Rule_Set?.update ? <>
                                                                <button
                                                                    className="mr-4 text-[#178eba]"
                                                                    onClick={() => handleEditOffline(row?.value_id)}
                                                                >
                                                                    <i className="fas fa-pen"></i>
                                                                </button>
                                                            </> : <>
                                                                <button
                                                                    className="mr-4 text-[#178eba]"
                                                                    onClick={() => permission('read')}
                                                                >
                                                                    <i className="fas fa-pen"></i>
                                                                </button>
                                                            </>}
                                                            {data?.role_permissions?.Rule_Set?.delete ? <>
                                                                <button
                                                                    className="text-red-500"
                                                                    onClick={() => handleDeleteOffline(row?.value_id)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </> : <>
                                                                <button
                                                                    className="text-red-500"
                                                                    onClick={() => permission('read')}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </>}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) :
                                                (
                                                    <tr>
                                                        <td colSpan="8" className="p-4 text-center text-red-500">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                )}
                                    </tbody>
                                </table>
                            </> : <></>}
                        </div>
                    </div>

                    {/*  2X Reward (Online) */}
                    <div className="max-w-6xl mx-auto p-8 shadow-md mt-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 w-full">
                                <h2 className="text-lg font-bold mb-4 text-gray-800">
                                    2x Reward subscription (online)
                                </h2>
                                <div>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        {data?.role_permissions?.Rule_Set?.update ? <>

                                            <input
                                                type="checkbox"
                                                name="switch7"
                                                checked={pointsListNew?.twox_reward_online?.status === "active"}
                                                className="sr-only peer"
                                                onChange={(e) =>
                                                    handleToggle("twox_reward_online", e.target.checked)
                                                }
                                            />
                                        </> : <>
                                            <input
                                                type="checkbox"
                                                name="switch7"
                                                checked={pointsListNew?.twox_reward_online?.status === "active"}
                                                className="sr-only peer"
                                                onChange={(e) =>
                                                    permission('read')
                                                }
                                            />
                                        </>}
                                        <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                                        <div
                                            className={`absolute left-0 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${pointsListNew?.twox_reward_online?.status === "active" ? "translate-x-4" : "translate-x-0"
                                                }`}
                                        ></div>
                                    </label>
                                </div>
                            </div>
                            {data?.role_permissions?.Rule_Set?.update ? <>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"

                                    onClick={() => handleOpenOnlineRewards(false)}
                                >
                                    Add
                                </button>
                            </> : <>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"

                                    onClick={() => permission('read')}
                                >
                                    Add
                                </button>
                            </>}
                        </div>
                        <div className="max-h-[278px] min-h-auto overflow-y-auto">
                            {pointsListNew?.twox_reward_online?.status == 'active' ? <>
                                <table className="w-full border-collapse border border-gray-300 mt-4">
                                    <thead>
                                        <tr className="bg-gray-200 text-left">
                                            {/* <th className="p-2 border border-gray-300">Status</th> */}
                                            <th className="p-2 border border-gray-300">Product SKU</th>
                                            <th className="p-2 border border-gray-300">Product Name</th>
                                            <th className="p-2 border border-gray-300">Points</th>
                                            <th className="p-2 border border-gray-300">Point Expiry </th>
                                            <th className="p-2 border border-gray-300"> Credit After Duration</th>
                                            <th className="p-2 border border-gray-300">Remarks </th>
                                            <th className="p-2 border border-gray-300">Created By</th>
                                            <th className="p-2 border border-gray-300">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            pointsListNew?.twox_reward_online?.value && pointsListNew?.twox_reward_online?.value.length > 0 ? (
                                                pointsListNew?.twox_reward_online?.value.map((row, index) => (
                                                    <tr key={index} className="hover:">

                                                        <td className="p-2 border border-gray-300">
                                                            {row?.product_sku ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.productName ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.points ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.expiresOn ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.creditAfter} &nbsp;{row?.creditType}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row?.remarks ?? "N/A"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {row.createdBy ?? "Super Admin"}
                                                        </td>
                                                        <td className="p-2 border border-gray-300">
                                                            {data?.role_permissions?.Rule_Set?.update ? <>
                                                                <button
                                                                    className="mr-4 text-[#178eba]"
                                                                    onClick={() => OnlineEditById(row?.value_id)}
                                                                >
                                                                    <i className="fas fa-pen"></i>
                                                                </button>
                                                            </> : <>
                                                                <button
                                                                    className="mr-4 text-[#178eba]"
                                                                    onClick={() => permission('read')}
                                                                >
                                                                    <i className="fas fa-pen"></i>
                                                                </button>
                                                            </>}
                                                            {data?.role_permissions?.Rule_Set?.delete ? <>
                                                                <button
                                                                    className="text-red-500"
                                                                    onClick={() => handleDelete2XOnline(row?.value_id)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </> : <>
                                                                <button
                                                                    className="text-red-500"
                                                                    onClick={() => permission('read')}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </>}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) :
                                                (
                                                    <tr>
                                                        <td colSpan="8" className="p-4 text-center text-red-500">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                )}
                                    </tbody>
                                </table>
                            </> : <></>}
                        </div>
                    </div>
                </div>
            </> : <></>}
            {/* -------------------------------------offline---------------- */}
            {selectedValue == 'rajnigandha' ? <>
                <div className="w-[95%] mx-auto p-8 mt-5 shadow-md">
                    <h1 className="text-2x1 font-bold text-blue-600">Offline</h1>
                    {/* SKU (Retail Coupon< */}
                    <div className="max-w-6xl mx-auto p-8 shadow-md mt-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4 w-full">
                                <h1 className="text-lg font-bold">
                                    Points Conversion - Retail Coupon
                                </h1>
                                <div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        {data?.role_permissions?.Rule_Set?.update ? <>

                                            <input
                                                type="checkbox"
                                                name="switch3"
                                                checked={pointsListNew?.coupon?.status === "active"}
                                                className="sr-only peer"
                                                onChange={(e) =>
                                                    handleToggle("coupon", e.target.checked)
                                                }
                                            />
                                        </> : <>
                                            <input
                                                type="checkbox"
                                                name="switch3"
                                                checked={pointsListNew?.coupon?.status === "active"}
                                                className="sr-only peer"
                                                onChange={(e) =>
                                                    permission('read')
                                                }
                                            />
                                        </>}
                                        <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors duration-300"></div>
                                        <div
                                            className={`absolute left-0 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 ${pointsListNew?.coupon?.status === "active" ? "translate-x-4" : "translate-x-0"
                                                }`}
                                        ></div>
                                    </label>
                                </div>
                            </div>
                            {data?.role_permissions?.Rule_Set?.update ? <>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
                                    onClick={handleOpenCoupon}
                                >
                                    Add
                                </button>
                            </> : <>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2"
                                    onClick={(e) => permission('read')}
                                >
                                    Add
                                </button>
                            </>}
                        </div>
                        <div className="max-h-[278px] min-h-auto overflow-y-auto">
                            {pointsListNew?.coupon?.status == 'active' ? <>
                                <table className="w-full border-collapse border border-gray-300 mt-4">
                                    <thead>
                                        <tr className="bg-gray-200 text-left">
                                            {/* <th className="p-2 border border-gray-300">Status</th> */}
                                            <th className="p-2 border border-gray-300">Product SKU</th>
                                            <th className="p-2 border border-gray-300">Product Name</th>
                                            <th className="p-2 border border-gray-300">Points</th>
                                            <th className="p-2 border border-gray-300">Point Expiry </th>
                                            <th className="p-2 border border-gray-300">Credit After Duration</th>
                                            <th className="p-2 border border-gray-300">Remarks </th>
                                            <th className="p-2 border border-gray-300">Created By</th>
                                            <th className="p-2 border border-gray-300">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pointsListNew?.coupon?.value && pointsListNew?.coupon?.value?.length > 0 ? (
                                            pointsListNew?.coupon?.value.map((row, index) => (
                                                <tr key={index} className="hover:">
                                                    <td className="p-2 border border-gray-300">
                                                        {row?.skuNo ?? "N/A"}
                                                    </td>
                                                    <td className="p-2 border border-gray-300">
                                                        {row?.productName ?? "N/A"}
                                                    </td>
                                                    <td className="p-2 border border-gray-300">
                                                        {row?.points ?? "N/A"}
                                                    </td>
                                                    <td className="p-2 border border-gray-300">
                                                        {row?.expiresOn ?? "N/A"}
                                                    </td>
                                                    <td className="p-2 border border-gray-300">
                                                        {row?.creditAfter} &nbsp;{row?.creditType}
                                                    </td>
                                                    <td className="p-2 border border-gray-300">
                                                        {row?.remarks ?? "N/A"}
                                                    </td>
                                                    <td className="p-2 border border-gray-300">

                                                        {row.createdBy ?? "Super Admin"}
                                                    </td>
                                                    <td className="p-2 border border-gray-300">
                                                        {data?.role_permissions?.Rule_Set?.update ? <>
                                                            <button
                                                                className="mr-4 text-[#178eba]"
                                                                onClick={() => CouponEditById(row?.value_id)}
                                                            >
                                                                <i className="fas fa-pen"></i>
                                                            </button>
                                                        </> : <>
                                                            <button
                                                                className="mr-4 text-[#178eba]"
                                                                onClick={() => permission('read')}
                                                            >
                                                                <i className="fas fa-pen"></i>
                                                            </button>
                                                        </>}
                                                        {data?.role_permissions?.Rule_Set?.delete ? <>

                                                            <button
                                                                className="text-red-500"
                                                                onClick={() => handleDeleteskuRetail(row?.value_id)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </> : <>
                                                            <button
                                                                className="text-red-500"
                                                                onClick={() => permission('read')}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </>}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="p-4 text-center text-red-500">
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </> : <></>}
                        </div>
                    </div>


                </div>
            </> : <></>}
            <div className="w-[95%] mx-auto p-8 mt-5 shadow-md">
                <h1 className="text-2x1 font-bold text-blue-600">Registration</h1>
        
                <div className="max-w-6xl mx-auto p-8 shadow-md mt-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 w-full">
                            <h1 className="text-lg font-bold">
                                Registration
                            </h1>

                        </div>
                    </div>
                    <div className="max-h-[278px] min-h-auto overflow-y-auto">
                        {/* {pointsListNew?.registration?.status == 'active' ? <> */}
                        <table className="w-full border-collapse border border-gray-300 mt-4">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-2 border border-gray-300">Points</th>
                                    <th className="p-2 border border-gray-300">Point Expiry </th>
                                    <th className="p-2 border border-gray-300">Credit After Duration</th>
                                    <th className="p-2 border border-gray-300">Remarks</th>

                                    <th className="p-2 border border-gray-300">Created By</th>
                                    <th className="p-2 border border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:">
                                    <td className="p-2 border border-gray-300">
                                        {registration?.point ?? "N/A"}
                                    </td>
                                    <td className="p-2 border border-gray-300">
                                        {registration?.expiry_day ?? "N/A"}
                                    </td>

                                    <td className="p-2 border border-gray-300">
                                        {registration?.credit_day ?? "N/A"}
                                    </td>
                                    <td className="p-2 border border-gray-300">
                                        {registration?.remarks ?? "N/A"}
                                    </td>
                                    <td className="p-2 border border-gray-300">

                                        Super Admin
                                    </td>
                                    <td className=" text-center p-2 border border-gray-300">
 
                                        {data?.role_permissions?.Rule_Set?.update ? <>

                                            <button
                                                className="mr-4 text-[#178eba]"
                                                onClick={() => RegistrationEditById(registration)}
                                            >
                                                <i className="fas fa-pen"></i>
                                            </button>
                                        </> : <>
                                            <button
                                                className="mr-4 text-[#178eba]"
                                                onClick={() => permission('read')}
                                            >
                                                <i className="fas fa-pen"></i>
                                            </button>
                                        </>}
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                        {/* </> : <></>} */}
                    </div>
                </div>

            </div>

            <Toast />
        </div>
    );
}

export default RuleSet;
import React, { useState, useEffect, useContext } from "react";
import { apiCall } from "../../api/Api";
import { showPopup } from "../../reusable/Toast";
import Toast from "../../reusable/Toast";
import LoaderSpiner from "../../reusable/LoaderSpiner";
import { HeaderContext } from '../../reusable/HeaderContext'
import msg from "../../reusable/msg.json"
// import Button from "../../reusable/Buttons";


const Transaction = () => {
  const [loading, setLoading] = useState(false);
  const { selectedValue } = useContext(HeaderContext);
  const [showLoader, setShowLoader] = useState(false);
  const [allCustomersList, setCustomersList] = useState([]);
  const [expiresAfter, setExpiresAfter] = useState("")
  const [expiresType, setExpiresType] = useState("")
  const [creditType, setCreditType] = useState("")
  const [creditAfter, setCreditAfter] = useState("")
  const [error, setError] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    // customer_id: allCustomersList[0]?.customer_id,
    amount: "",
    action: "",
    note: "",
    customNote: "",
    store: selectedValue
  });

  const [noteOptions] = useState([
    { value: "order", label: "Order" },
    { value: "refund_order", label: "Refund Order" },
    { value: "others", label: "Others" },
  ]);

  const [orderLabel, setOrderLabel] = useState('');
  const [isNotePopupOpen, setNotePopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [Order, setOrder] = useState(false);
  const [OrderCustomer, setOrderCustomer] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);


  useEffect(() => {
    if (Array.isArray(OrderCustomer) && OrderCustomer.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        note: prevData.note || OrderCustomer[0].id,  // Set first value only if note is empty
      }));
    }
  }, [OrderCustomer]);

  const handleChangeNote = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const customerId = formData.customer_id || selectedCustomer?.customer_id;

  const fetchOrderCustomer = async (type) => {
    if (!customerId) {
      setOrderCustomer([]);
      return;
    }
    const data = { customer_id: customerId };
    if (type === 'refund_order') data.type = 'refunded';
    try {
      const response = await apiCall("/points/findOrderCustomer", "post", data);
      if (response.status === 200) {
        setOrderCustomer(response?.data || []);
      } else {
        setOrderCustomer([]);
      }
    } catch (err) {
      setShowLoader(false);
      setOrderCustomer([]);
      console.error("Failed to fetch data:", err);
    }
  };

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (value === 'order') {
      setOrder(true);
      setOrderLabel('Order');
      fetchOrderCustomer('order');
    } else if (value === 'refund_order') {
      setOrder(true);
      setOrderLabel('Refund Order');
      fetchOrderCustomer('refund_order');
    } else {
      setOrder(false);
      setOrderLabel('');
    }
    if (value === 'others') setNotePopupOpen(true);
    else setNotePopupOpen(false);
  };

  const handleActionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && /^[0-9]*$/.test(value))) {
      setFormData((prevData) => ({ ...prevData, amount: value }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'action') handleActionChange(e);
    else if (name === 'note') handleNoteChange(e);
    else setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const cid = formData.customer_id || selectedCustomer?.customer_id;
    if (!cid) {
      showPopup("error", "Please select a customer");
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      customer_id: cid,
      store: formData.store || selectedValue,
    };

    if (formData.action === "credit") {
      const currentDate = new Date();
      let expiryDate;
      if (expiresType === "days") {
        expiryDate = new Date(currentDate);
        expiryDate.setDate(expiryDate.getDate() + parseInt(expiresAfter, 10));
      } else if (expiresType === "months") {
        expiryDate = new Date(currentDate);
        expiryDate.setMonth(expiryDate.getMonth() + parseInt(expiresAfter, 10));
      }

      let creditTotalDays = 0;
      if (creditType === "days") {
        creditTotalDays = parseInt(creditAfter, 10) || 0;
      } else if (creditType === "months") {
        const startDate = new Date(currentDate);
        for (let i = 0; i < parseInt(creditAfter, 10); i++) {
          const monthDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
          creditTotalDays += monthDays;
          startDate.setMonth(startDate.getMonth() + 1);
        }
      }

      payload.expiry_date = expiryDate ? formatDate(expiryDate) : "";
      payload.expiry_day = `${expiresAfter} ${expiresType}`;
      payload.credit_after = creditTotalDays;
      payload.credit_days = `${creditTotalDays}`;
    }

    try {
      const response = await apiCall("/customer/admintransaction", "POST", payload);
      if (response.status === 200) {
        showPopup("success", "Transaction saved successfully!");
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      const errMsg = error?.message?.errors || error?.message || (typeof error === 'string' ? error : 'Failed to save');
      showPopup("error", errMsg);
      console.error("Failed to submit form:", error);
    } finally {
      setLoading(false);
    }

    setFormData({
      amount: "",
      action: "",
      note: "",
      customNote: "",
      store: selectedValue,
    });
    setSelectedCustomer(null);
    setSearchTerm("");
    setDebouncedSearch("");
    setCustomersList([]);
    setExpiresAfter("");
    setExpiresType("");
    setCreditType("");
    setCreditAfter("");
    setOrderCustomer([]);
    setOrder(false);
    setOrderLabel("");
  };

  useEffect(() => {
    if (debouncedSearch.trim()) {
      let formDataCreat = {
        searchOption: debouncedSearch
      }
      const customerSearch = async () => {
        setShowLoader(true)
        try {
          const response = await apiCall("/customer/searchEmailPhoneCustomerID", "POST", formDataCreat);
          if (response.status === 200) {
            setShowLoader(false);
            setCustomersList(response?.data || []);
            setShowDropdown(true)
            showPopup("success", 'Successfully fetching customer details');
          } else {
            throw new Error(`Error: ${response.statusText}`);

          }
        } catch (error) {
          showPopup("error", error?.message?.errors || error?.message || (typeof error === 'string' ? error : 'Search failed'));
          console.error("Failed to search:", error);
        } finally {
          setShowLoader(false)
        }
      }
      customerSearch()
    }
  }, [debouncedSearch]);


  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);


  const handleSearch = (e) => {
    const input = e.target.value;
    const digitsOnly = input.replace(/\D/g, "");
    setSearchTerm(digitsOnly);
    if (digitsOnly.length < 10) setError(true);
    else {
      setError(false);
      setFormData((prev) => ({ ...prev, customer_id: null }));
      setSelectedCustomer(null);
      setDebouncedSearch(digitsOnly);
    }
  };

  const handleCancel = () => {
    setFormData((prev) => ({ ...prev, customer_id: "" }));
    setSelectedCustomer(null);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData((prev) => ({
      ...prev,
      customer_id: customer.customer_id,
      balance_point: customer.balance_point,
    }));
    setShowDropdown(false);
  };


  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <Toast />
      <h2 className="text-2xl font-semibold mb-5">Customer Benefits</h2>
      <form onSubmit={handleSave} className="space-y-4">

        <div className="mb-5 relative">
          <label className="block text-gray-700 font-medium mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by Mobile No"
              value={
                formData.customer_id && (selectedCustomer || allCustomersList.find((c) => c.customer_id === formData.customer_id))
                  ? (() => {
                      const c = selectedCustomer || allCustomersList.find((cust) => cust.customer_id === formData.customer_id);
                      return `${c?.first_name || c?.phone_number || ""}, ${c?.email || ""} (Balance: ${c?.balance_point ?? 0})`;
                    })()
                  : searchTerm
              }
              onChange={handleSearch}
              maxLength={100}
              className="w-full p-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {formData.customer_id && (
              <button
                onClick={handleCancel}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              >
                ✖
              </button>
            )}
            {error ? <><span className="text-gray-500">Enter 10 Digits Mobile Number</span></> : <></>}
          </div>

          {showDropdown && searchTerm.trim() && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-auto">
              {allCustomersList.length > 0 ? (
                allCustomersList.map((customer, index) => (
                  <div
                    key={`${customer.customer_id}-${index}`}
                    onClick={() => handleSelect(customer)}
                    className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                  >
                    <div className="font-semibold">{customer.phone_number}</div>
                    <div className="text-sm text-gray-600">{customer.email}</div>
                    <div className="text-xs text-gray-500">ID: {customer.customer_id}</div>
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No customers found</div>
              )}
            </div>
          )}


        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">
            Point <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            onWheel={(e) => e.target.blur()}
            name="amount"
            value={formData.amount}
            onChange={handleAmountChange}
            className="w-full p-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter points"
          />

        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">
            Action <span className="text-red-500">*</span>
          </label>
          <select
            name="action"
            required
            value={formData.action}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Action</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>

        {formData.action === "credit" ? <>
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
                <option value=""> Select </option>
                <option value="days">Days</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="mt-2">
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

        </> : <></>
        }


        {/* "expiry_date":"2025-02-12",
        "credit_days":"3" */}


        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">
            Note <span className="text-red-500">*</span>
          </label>
          <select
            name="note"
            value={formData.note}
            required
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select Note</option>
            {noteOptions.map((note) => (
              <option key={note.value} value={note.value}>
                {note.label}
              </option>
            ))}
          </select>
        </div>
        {Order && (
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">
              {orderLabel} <span className="text-red-500">*</span>
            </label>
            <select
              name="note"
              required
              value={formData.note}
              onChange={handleChangeNote}
              className="w-full p-3 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" >select option</option>
              {
                OrderCustomer.length ? OrderCustomer.map((note) => (
                  <option key={note?.id} value={note?.id}>
                    {note?.id}
                  </option>
                )
                ) :
                  <option >
                    No data available.
                  </option>
              }
            </select>
          </div>
        )}
        {isNotePopupOpen && (
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">
              Custom Note <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              name="customNote"
              value={formData.customNote}
              onChange={handleChange}
              className="w-full p-3 border rounded-md mb-4"
              placeholder="Enter your custom note"
            />
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="w-20 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Loading..." : "Save"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Transaction;
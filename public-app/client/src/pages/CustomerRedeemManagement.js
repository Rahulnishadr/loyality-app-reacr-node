import React, { useEffect, useRef, useState } from 'react'
import { } from 'react';
import { apiCall } from '../api/Api';
import { showPopup } from '../reusable/Toast';
import LoaderSpiner from '../reusable/LoaderSpiner';
import msg from "../reusable/msg.json"
const CustomerRedeemManagement = () => {

  const minRedemption = useRef(null);
  const dailyRedemptionLimit = useRef(null);
  const dailyVoucherLimit = useRef(null);
  const [id, setId] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      e.target.value = 0;
    }
  };

  const handleSave = async() => {
    setShowLoader(true)
    
    const data = {
      id : id ? id : '',
      minimum_redemption : minRedemption.current.value,
      limitation_per_day : dailyRedemptionLimit.current.value,
      vochuer_limitation_per_day : dailyVoucherLimit.current.value,
    }

    try {
      const response = await apiCall("/points/creteRedemRule", "POST", data);
      if(response.status === 201) {
        showPopup("success", "Configuration Created successfully");
        setShowLoader(false)
      }
      else if(response.status === 200) {
        showPopup("success", "Configuration Updated successfully");
        setShowLoader(false)
      }
      else {setShowLoader(false)}
    }
    catch(error) {
      
      setShowLoader(false);
    }
  };

  const handleGetRedeemRule = async () => {
    setShowLoader(true);
    try {
      const response = await apiCall("/points/getRedemRule?store=rajnigandha", "GET", {});
      if (response.status === 200) {

        const fetchedData = response?.data[0];
        setId(fetchedData.id);
        if (minRedemption.current) {
          minRedemption.current.value = parseInt(fetchedData?.minimum_redemption, 10);
        }
        if (dailyRedemptionLimit.current) {
          dailyRedemptionLimit.current.value = parseInt(fetchedData?.limitation_per_day, 10);
        }
        if(dailyVoucherLimit.current) {
          dailyVoucherLimit.current.value = parseInt(fetchedData?.vochuer_limitation_per_day, 10);
        }

        setShowLoader(false)
      }
    }
    catch (err) {
      showPopup("error", err.message);
      setShowLoader(false)
    }
  }

  useEffect(() => {
    handleGetRedeemRule();
  }, [])

  return (
    <div className="flex justify-center items-center h-full shadow-md bg-gray-50">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Redeem Point Configuration</h2>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="minRedemption"
              className="block text-gray-700 font-medium"
            >
              Minimum Redemption (Product of DS Group):
            </label>
          </div>
          <input
            type="number"
            id="minRedemption"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="1000"
            ref={minRedemption}
            onWheel={(e) => e.target.blur()}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="dailyRedemptionLimit"
            className="block text-gray-700 font-medium mb-2"
          >
            Limitation of Redemption per day:
          </label>
          <input
            type="number"
            id="dailyRedemptionLimit"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="1"
            ref={dailyRedemptionLimit}
            onWheel={(e) => e.target.blur()}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="dailyRedemptionLimit"
            className="block text-gray-700 font-medium mb-2"
          >
            Limitation of Redemption per voucher:
          </label>
          <input
            type="number"
            id="dailyRedemptionLimit"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="1"
            ref={dailyVoucherLimit}
            onWheel={(e) => e.target.blur()}
            onChange={handleInputChange}
          />
        </div>

        <div className="text-center">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 float-right text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-blue-400"
          >
            {id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomerRedeemManagement

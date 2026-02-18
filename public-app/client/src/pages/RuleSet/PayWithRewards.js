import React, { useState, useContext, useEffect } from 'react';
import { apiCall } from '../../api/Api';
import { showPopup } from '../../reusable/Toast';
import Toast from '../../reusable/Toast';
import LoaderSpiner from '../../reusable/LoaderSpiner';
import { HeaderContext } from "../../reusable/HeaderContext"
import msg from "../../reusable/msg.json"

const PayWithRewards = () => {
  const { selectedValue } = useContext(HeaderContext);
  const [id, setId] = useState()
  const [showData, setShowData] = useState();
  const [maxPointLimited, setMaxPointLimited] = useState("");

  const [showLoader, setShowLoader] = useState(false);
   const [formData, setFormData] = useState({
    enable: false,
    redemptionType: '',
    conversionRate: '',
    rewardsPointAwarded: '',
    minCap: '',
    maxCap: '',
    maxPointLimited: '',
    multipleOfSix: '',
  });

  const multiplesOptions = [3, 6, 9, 20 ,30, 40];

  const getAllPayWithRewards = async () => {
    setShowLoader(true)
    try {
      const response = await apiCall(`/points/getAllPWR?store=${selectedValue}`, 'GET');
      if (response.status === 200) {
        const data = response.data[0];
        setId(data?.id);
        setFormData({
          enable: data?.enable,
          redemptionType: data?.redemption_type,
          conversionRate: data?.point_conversion_rate,
          rewardsPointAwarded: data?.reward_point_awarded_on_purchase,
          minCap: data?.minValue,
          maxCap: data?.maxValue,
          // maxPointLimited: data?.max_point_limit,
          multipleOfSix: data?.customer_redeem_point_multiple,
        });
        if (data?.redemption_type == 'partial') {
          setShowData(true);
        } else {
          setShowData(false);
        } 
        setMaxPointLimited(data?.max_point_limit)
        
        setShowLoader(false)
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      setShowLoader(false)
      console.error('Failed to fetch data:', error);
    }
    finally{
      setShowLoader(false)
    }
  };

  useEffect(() => {
    getAllPayWithRewards();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "maxPointLimited") {
      setMaxPointLimited(value);
      return;
    }

    if (value === 'partial') {
      setShowData(true);
    } else {
      setShowData(false);
    }

    setFormData((prevData) => {
      if (name === 'enable') {
        return { ...prevData, enable: checked ? 'yes' : 'no' };
      }
      if (name === 'redemptionType' || name === 'rewardsPointAwarded') {
        return { ...prevData, [name]: checked ? value : '' };
      }

      return { ...prevData, [name]: type === 'checkbox' ? checked : value };
    });
  };


  const handleSubmit = async () => {
    setShowLoader(true)
    const payload = {
      id: id || null,
      enable: formData.enable === 'yes' ? 'yes' : 'no',
      redemption_type: formData.redemptionType,
      point_conversion_rate: formData.conversionRate,
      reward_point_awarded_on_purchase: formData.rewardsPointAwarded,
      remarks: 'Updated redemption for VIP customers',
      minValue: formData.minCap,
      maxValue: formData.maxCap,
      max_point_limit: maxPointLimited,
      customer_redeem_point_multiple: formData.multipleOfSix || 6,
      createdBy: 'admin',
    };

    try {
      const response = await apiCall('/points/createOrUpdateRedemption', 'POST', payload);
      if (response.status === 200) {
        setShowLoader(false)
        getAllPayWithRewards()
        showPopup('success', 'Role updated successfully!');
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      showPopup('error', error?.response?.data?.message?.errors || error?.message);
      console.error('Failed to submit form:', error);
    }

    // Clear form data
    setFormData({
      enable: false,
      redemptionType: '',
      conversionRate: '',
      rewardsPointAwarded: '',
      minCap: '',
      maxCap: '',
      maxPointLimited: '',
      multipleOfSix: '',
    });
    
  };

  const data = {};

  const permission = (data) => {
    if (data == "read") {
        showPopup('warning', msg.readOnly)
    }
}

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      <div className="p-8 border rounded-lg shadow-md bg-gray-50 max-w-3xl mx-auto ">
        {showLoader && <LoaderSpiner text="Loading ..." />}
        <Toast />
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reward Point Configuration</h2>

        <div className="mb-5 flex items-center justify-between">
          <label className="font-medium text-gray-700">Status</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="enable"
              checked={formData.enable == "yes"}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-500 transition-all duration-300"></div>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300"></div>
          </label>
        </div>

        <div className="mb-5">
          <label className="block font-medium text-gray-700 mb-2">Redemption Type</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="redemptionType"
                value="partial"
                checked={formData.redemptionType == 'partial'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">Partial</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="redemptionType"
                value="full"
                checked={formData.redemptionType == 'full'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">Full</span>
            </label>
          </div>
        </div>

        <div className="mb-5">
          <label className="block font-medium text-gray-700 mb-2">Points Conversion Rate</label>
          <input
            type="text"
            name="conversionRate"
            value={formData.conversionRate}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter rate (e.g., 1 Point = 0.20)"
          />
          <p className="text-xs text-gray-600 mt-2">
            <b>Note:</b> Above points are equal to 1 Rupee.
          </p>
        </div>

        <div className="mb-5">
          <label className="block font-medium text-gray-700 mb-2">Rewards Point Awarded on Purchase</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rewardsPointAwarded"
                value="yes"
                checked={formData.rewardsPointAwarded === 'yes'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rewardsPointAwarded"
                value="no"
                checked={formData.rewardsPointAwarded === 'no'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        </div>

        <div className="mb-5">
          <label className="block font-medium text-gray-700 mb-2">Min & Max Cap of order value (Rs)</label>
          <div className="flex gap-4">
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="minCap"
              value={formData.minCap}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Min Cap"
            />
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="maxCap"
              value={formData.maxCap}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Max Cap"
            />
          </div>
        </div>

        {showData && (

          <div className="mb-5">
            <label className="block font-medium text-gray-700 mb-2">Maximum Point Using Limited</label>
            {/* <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="maxPointLimited"
              value={formData.maxPointLimited}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter maximum point"
            /> */}
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="maxPointLimited"
              value={maxPointLimited}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter maximum point"
            />
          </div>
        )}

        <div className="mb-5">
          <label className="block font-medium text-gray-700 mb-2">Multiple of number</label>
          <select
            name="multipleOfSix"
            value={formData.multipleOfSix || 6}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >

            {/* <option value="" disabled >Select multiple</option> */}
            {multiplesOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-4">
        {data?.role_permissions?.Rule_Set?.update ? <>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition duration-200"
            >
            {showLoader ? <>Loading</> : <>Submit</>}
          </button>
            </>:<>
            <button
            onClick={()=>permission('read')}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition duration-200"
            >
            {showLoader ? <>Loading</> : <>Submit</>}
          </button>
            </>}
        </div>
      </div>
    </div>
  );
};

export default PayWithRewards;

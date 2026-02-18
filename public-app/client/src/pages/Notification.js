
import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { apiCall } from '../api/Api';
import LoaderSpiner from "../reusable/LoaderSpiner";
import Toast from "../reusable/Toast";
import { showPopup } from "../reusable/Toast";

function Notification() {
  const [showLoader, setShowLoader] = useState(false);
  const [formData, setFormData] = useState({
    whatsappUsername: '',
    whatsappPassword: '',
    smsUsername: '',
    smsPassword: '',
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    whatsappPassword: false,
    smsPassword: false,
  });

  // Update form data dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Fetch and autofill form data
  const fetchNotificationData = async () => {
    // setShowLoader(true);
    try {
      const response = await apiCall("/notification/list", "get");
      if (response.status === 200) {
       
        setFormData({
          whatsappUsername: response.data[0].whatsapp_cred.username || '',
          whatsappPassword: response.data[0].whatsapp_cred.password || '',
          smsUsername: response.data[0].sms_cred.username || '',
          smsPassword: response.data[0].sms_cred.password || '',
        });
        setShowLoader(false);
      } else {
        setShowLoader(false);
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) { 
      setShowLoader(false);
    }
  };

  // Handle save for WhatsApp and SMS
  const handleSave = async (type) => {
    const data = {
      id: 1,
      store: "rajnigandha",
      [`${type}_cred`]: {
        username: formData[`${type}Username`],
        password: formData[`${type}Password`],
      },
    };

    try {
      const response = await apiCall("/notification/createOrUpdateNotification", "post", data);
      if (response.status === 200) {
        showPopup("success", "Updated successfully!");
        setShowLoader(false);
      } else {
        setShowLoader(false);
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      setShowLoader(false);
      console.error("Failed to save data:", error);
    }
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <h1 className="text-2xl font-medium mb-4">Notification Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Notification */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-md transition-shadow">
          <img
            src="https://img.icons8.com/color/96/000000/whatsapp.png"
            alt="WhatsApp Icon"
            className="w-12 h-12 mx-auto mb-4"
          />
          <h2 className="text-base font-normal">WhatsApp Notification</h2>
          <input
            type="text"
            name="whatsappUsername"
            placeholder="Username"
            value={formData.whatsappUsername}
            onChange={handleInputChange}
            className="mt-4 px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="relative mt-4">
            <input
              type={passwordVisibility.whatsappPassword ? 'text' : 'password'}
              name="whatsappPassword"
              placeholder="Password"
              value={formData.whatsappPassword}
              onChange={handleInputChange}
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div
              onClick={() => togglePasswordVisibility('whatsappPassword')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {passwordVisibility.whatsappPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-green-600 transition"
            onClick={() => handleSave('whatsapp')}
          >
            Save
          </button>
        </div>

        {/* SMS Notification */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-md transition-shadow">
          <img
            src="https://img.icons8.com/color/96/000000/sms.png"
            alt="SMS Icon"
            className="w-12 h-12 mx-auto mb-4"
          />
          <h2 className="text-base font-normal">SMS Notification</h2>
          <input
            type="text"
            name="smsUsername"
            placeholder="Username"
            value={formData.smsUsername}
            onChange={handleInputChange}
            className="mt-4 px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="relative mt-4">
            <input
              type={passwordVisibility.smsPassword ? 'text' : 'password'}
              name="smsPassword"
              placeholder="Password"
              value={formData.smsPassword}
              onChange={handleInputChange}
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div
              onClick={() => togglePasswordVisibility('smsPassword')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {passwordVisibility.smsPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => handleSave('sms')}
          >
            Save
          </button>
        </div>
      </div>
      <Toast />
    </div>
  );
}

export default Notification;

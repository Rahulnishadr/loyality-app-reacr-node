import React, { useState, useEffect, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { showPopup } from '../reusable/Toast';
import Toast from '../reusable/Toast';
import LoaderSpiner from '../reusable/LoaderSpiner';
import { HeaderContext } from "../reusable/HeaderContext";
import { apiCall } from "../api/Api";
import msg from "../reusable/msg.json";
import { HTTP_METHODS, HTTP_RESPONSE } from "../reusable/constants";

function Shopify() {

  const [showLoader, setShowLoader] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [apiVersion, setApiVersion] = useState("");
  const [showAccessToken, setShowAccessToken] = useState(false);
  const { selectedValue } = useContext(HeaderContext);
  const [validationError, setValidationError] = useState("");
  const [count, setCount] = useState(0);
   const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchAccessData();
  }, [selectedValue]);

  const fetchAccessData = async () => {
    setShowLoader(true);
    try {
      const response = await apiCall(`/access/list?store=${selectedValue}`, HTTP_METHODS.GET);
      if (response.status === HTTP_RESPONSE.SUCCESS && Array.isArray(response.data) && response.data.length > 0) {
        const { id, shopname, access_token, apiVersion } = response?.data?.[0] || {};

        setId(id);
        setSecretKey(shopname || "");
        setAccessToken(access_token || "");
        setApiVersion(apiVersion || "");
        setCount(response?.data?.length);
        showPopup("success", msg.fetchedSuccessfully);
      } else {
        showPopup("success", response.message || msg.noDataFound);
      }
    } catch (error) {
      setId("");           // Reset states to avoid stale data
      setSecretKey("");
      setAccessToken("");
      showPopup("error", error.message || msg.faildedToLoad);
    } finally {
      setShowLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!secretKey.endsWith(".myshopify.com")) {
      setValidationError(
        "Please enter a valid Shopify store name (e.g., mystore.myshopify.com)"
      );
      return;
    }

    setValidationError("");
    const payload = {
      store: selectedValue,
      shopname: secretKey,
      access_token: accessToken,
      apiVersion,
    };

    try {
      const response = await apiCall("/access/create", HTTP_METHODS.POST, payload);
      setLoading(true);
      // 
      if (response.status === HTTP_RESPONSE.CREATED) {
        const { id, shopname, access_token, apiVersion } = response.data;
        setId(id);
        setSecretKey(shopname || "");
        setAccessToken(access_token || "");
        setApiVersion(apiVersion || "");
        showPopup("success", response.message);
        setLoading(false)
      } else {
        showPopup("error", response.message);
      }
    } catch (error) {
      console.error("Error creating access:", error);
      showPopup("error", msg.failedToCreateAccess);
    }
  };

  const handleUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!id) {
      alert(msg.notRecordFound);
      return;
    }

    const payload = {
      id: id,
      store: selectedValue,
      apiVersion: apiVersion,
      access_token: accessToken,
      shopname:secretKey
    };

    try {
      const response = await apiCall("/access/update", HTTP_METHODS.PUT, payload);
      // 
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        setLoading(false);  
        showPopup("success", response.message);
      } else {
        showPopup("error", response.message);
      }
    } catch (error) {
      setLoading(false);
      // console.error("Error updating access:", error);
      showPopup("error", msg.failedToUpdateAccess);
    }
  };

  const data = {};

  const disableUpdate = () => {
    showPopup('warning', msg.readOnly);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center shadow-md">
      {(showLoader || loading) && <LoaderSpiner text="Loading ..." />}
      <div className="w-full max-w-md mx-auto p-8 shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Shopify Integration
        </h2>
        {/* {error && <p className="text-center text-red-500">{error}</p>} */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="shopifyStoreName"
              className="block text-gray-700 font-medium mb-2"
            >
              Shopify Store Name:
            </label>
            <div>
              <input
                type="text"
                id="shopifyStoreName"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your store name"
                className={`w-full px-4 py-2 border ${validationError ? "border-red-500" : "border-gray-300 focus:ring-blue-500"
                  } rounded-md focus:outline-none focus:ring-2`}
              />
            </div>
            {validationError && (
              <p className="text-red-500 text-sm mt-2">{validationError}</p>
            )}
          </div>

          {/* Access Token Input */}
          <div>
            <label
              htmlFor="accessToken"
              className="block text-gray-700 font-medium mb-2"
            >
              Access Token:
            </label>
            <div className="relative">
              <input
                type={showAccessToken ? "text" : "password"}
                id="accessToken"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter your access token"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowAccessToken(!showAccessToken)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none"
              >
                {showAccessToken ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="apiVersion"
              className="block text-gray-700 font-medium mb-2"
            >
              Api Version

            </label>
            <div>
              <input
                type="text"
                id="apiVersion"
                value={apiVersion}
                onChange={(e) => setApiVersion(e.target.value)}
                placeholder="Enter your  api version"
                className={`w-full px-4 py-2 border ${validationError ? "border-red-500" : "border-gray-300 focus:ring-blue-500"
                  } rounded-md focus:outline-none focus:ring-2`}
              />
            </div>
            {validationError && (
              <p className="text-red-500 text-sm mt-2">{validationError}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
          
            {data?.role_permissions?.Redeem_History?.read?<>
              <button
              type="button"
              onClick={count === 0 ? handleSubmit : handleUpdate}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            >
              {count === 0 ? "Create" : "Update"}
            </button>
            </>:<>
            <button
              type="button"
              onClick={disableUpdate()}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            >
              {count === 0 ? "Create" : "Update"}
            </button>
            </>}
           
          </div>
        </form>
      </div>
      <Toast />
    </div>
  );
}

export default Shopify;

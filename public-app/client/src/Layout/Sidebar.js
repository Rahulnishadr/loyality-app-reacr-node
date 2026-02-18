import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUserTie,
  FaUsers,
  FaRegClipboard,
  FaTasks, 
  FaCog, 
  FaListAlt,
  FaExchangeAlt,
  FaGift,
  FaShopify,
  FaBullhorn, 
} from "react-icons/fa"; 
import { NavLink } from "react-router-dom";
import { MdRedeem } from "react-icons/md";   
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setSelectedMenu(menu === selectedMenu ? null : menu);
  };

  const data = {
    role_permissions: {
      Rule_Set: { enabled: true },
      Transaction_Management: { enabled: true },
      Customer_Management: { enabled: true },
      Management: { enabled: true },
      Setting: { enabled: true },
    },
  };


  return (
    <div className="w-full min-h-screen bg-white shadow-md ">
      <div className="px-4 py-2">


        <NavLink to="/dashboard">
          <h2 className="text-gray-800 font-semibold text-xl mb-4 flex items-center">
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </h2>
        </NavLink>


        {/* Rule Set */}
        {data?.role_permissions?.Rule_Set && data?.role_permissions?.Rule_Set?.enabled? <>
          <button
            onClick={() => toggleMenu("Rule_Set")}
            className={`flex items-center w-full text-left py-2 ${openMenu === "Rule_Set" ? "text-blue-500" : "text-gray-800"
              } hover:bg-gray-100 font-medium`}
          >
            <FaRegClipboard className="mr-2" />
            Rule Set
            <KeyboardArrowDownIcon />

          </button>
        </> : <></>}

        {openMenu === "Rule_Set" && (
          <div className="pl-4">
            <NavLink
              to="/rule-set"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
              onClick={() => {
                setSelectedMenu("Rule_Set"); 
              }}
            >
              <FaListAlt className="mr-2" /> Ruleset List
            </NavLink>
            <NavLink
              to="/transaction"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
              onClick={() => {
                setSelectedMenu("Rule_Set"); 
              }}
            >
              <FaExchangeAlt className="mr-2" /> Customer Benefits
            </NavLink>
            <NavLink
              to="/PayWithRewards"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
              onClick={() => {
                setSelectedMenu("Rule_Set"); 
              }}
            >
              <FaGift className="mr-2" /> Pay with Rewards
            </NavLink>

            <NavLink
              to="/customer-redeem-management"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
              onClick={() => {
                setSelectedMenu("Rule_Set"); 
              }}
            >
              <MdRedeem className="mr-2 text-2xl" /> Customer Redeem Management
            </NavLink>
          </div>
        )}

        {/* transaction management */}
        {data?.role_permissions?.Transaction_Management && data?.role_permissions?.Transaction_Management?.enabled? <>
          <button
            onClick={() => toggleMenu("transaction")}
            className={`flex items-center w-full text-left py-2  ${openMenu === "transaction" ? "text-blue-500" : "text-gray-800"
              } hover:bg-gray-100 font-medium`}
          >
            <FaExchangeAlt className="mr-2" /> Transaction Management
            <KeyboardArrowDownIcon />
          </button>
        </> : <></>}

        {openMenu === "transaction" && (
          <div className="pl-4">
            <NavLink
              to="/transaction-management"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
              onClick={() => {
                setSelectedMenu("transaction"); 
              }}
            >
              <FaListAlt className="mr-2" /> Transaction List
            </NavLink>
          </div>
        )}
        {/* Customer Management */}
        {data?.role_permissions?.Customer_Management && data?.role_permissions?.Customer_Management?.enabled? <>
          <button
            onClick={() => toggleMenu("CustomerManagement")}
            className={`flex items-center w-full text-left py-2 font-medium ${openMenu === "CustomerManagement"
              ? "text-blue-500"
              : "text-gray-800"
              } hover:bg-gray-100`}
          >
            <FaUsers className="mr-2" />
            Customer Management
            <KeyboardArrowDownIcon />

          </button>
        </> : <></>}

        {openMenu === "CustomerManagement" && (
          <div className="pl-4">
            <NavLink
              to="/customer-list"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
              onClick={() => {
                setSelectedMenu("CustomerManagement");
              }}
            >
              <FaListAlt className="mr-2" /> Customer List
            </NavLink>
          </div>
        )}

        {/* Management */}
        {data?.role_permissions?.Management && data?.role_permissions?.Management?.enabled? <>
          <button
            onClick={() => toggleMenu("Management")}
            className={`flex items-center w-full text-left py-2 ${openMenu === "Management" ? "text-blue-500" : "text-gray-800"
              } hover:bg-gray-100 font-medium`}
          >
            <FaTasks className="mr-2" />
            Management
            <KeyboardArrowDownIcon />

          </button>
        </> : <></>}

        {openMenu === "Management" && (
          <div className="pl-4">
            {/* Membership Management */}
            <NavLink
              to="/membership-management"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaUserTie className="mr-2" /> Membership Management

            </NavLink>

            {/* Campaign */}
            <NavLink
              to="/campaign"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaBullhorn className="mr-2" /> Campaign
            </NavLink>
          </div>
        )}

       
 

        {/* Setting */}
        {data?.role_permissions?.Setting && data?.role_permissions?.Setting?.enabled? <>
          <button
            onClick={() => toggleMenu("Setting")}
            className={`flex items-center w-full text-left py-2 ${openMenu === "Setting" ? "text-blue-500" : "text-gray-800"
              } hover:bg-gray-100 font-medium`}
          >
            <FaCog className="mr-2" />
            Setting
            <KeyboardArrowDownIcon />

          </button>
        </> : <></>}

        {openMenu === "Setting" && (
          <div className="pl-4">
            <NavLink
              to="/shopify"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaShopify className="mr-2" /> Shopify
            </NavLink>

          </div>
        )}

        
         
      </div>
    </div>
  );
}

export default Sidebar;
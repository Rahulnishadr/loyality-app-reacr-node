import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUserTie,
  FaUsers,
  // FaRegClipboard,
  // FaTasks,  
  FaCog,
  FaPlusSquare,
  FaListAlt,
  FaExchangeAlt,
  // FaGift,
  FaShopify,
  FaBullhorn,
  // FaTable,
} from "react-icons/fa";
// import { GrTransaction } from "react-icons/gr";
// import { IoMdNotifications } from "react-icons/io";
import { NavLink } from "react-router-dom";

// import { AiFillProduct } from "react-icons/ai";   
// import { RiCoupon3Fill } from "react-icons/ri";
// import { RiCoupon2Fill } from "react-icons/ri";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// rclub
function Sidebar() {

  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setOpenSubMenu(null); // Close any open submenus when a new menu is opened
    setSelectedMenu(menu === selectedMenu ? null : menu); // Set selected menu
    setSelectedSubMenu(null); // Reset submenu selection
  };
  const toggleSubMenu = (submenu) => {
    setOpenSubMenu(openSubMenu === submenu ? null : submenu);
    setSelectedSubMenu(submenu === selectedSubMenu ? null : submenu); // Set selected submenu
  };
  return (
    <div className="w-full min-h-screen bg-white shadow-md ">
      <div className="px-4 py-2">
        <NavLink to="/analytics">
          <h2 className="text-gray-800 font-semibold text-xl mb-4 flex items-center">
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </h2>
        </NavLink>


        {/* <button
          onClick={() => toggleSubMenu("Coupon_Management")}
          className={`flex items-center w-full text-left py-2 ${openSubMenu === "Coupon_Management"
            ? "text-blue-500"
            : "text-gray-800"
            } hover:bg-gray-100`}
        >
          <RiCoupon2Fill className="mr-2" /> Coupon Management
          <KeyboardArrowDownIcon />

        </button> */}
        {openSubMenu === "Coupon_Management" && (
          <div className="pl-4">
            <NavLink
              to="/coupons-list"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaListAlt className="mr-2" /> Coupon List
            </NavLink>
            <NavLink
              to="/used-coupon-list"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaListAlt className="mr-2" /> Used Coupon List
            </NavLink>
            <NavLink
              to="/expired-coupon"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaListAlt className="mr-2" /> Expired Coupon List
            </NavLink>
          </div>
        )}



        {/* Coupon / Product Management
        <button
          onClick={() => toggleMenu("couponproduct")}
          className={`flex items-center w-full text-left py-2 ${openMenu === "couponproduct" ? "text-blue-500" : "text-gray-800"
            } hover:bg-gray-100 font-medium`}
        >
          <RiCoupon3Fill className="mr-2" />
          Coupon / Product Management
          <KeyboardArrowDownIcon />
        </button>
        {openMenu === "couponproduct" && (
          <div className="pl-4">
          
 
            <button
              onClick={() => toggleSubMenu("Coupon_Management")}
              className={`flex items-center w-full text-left py-2 ${openSubMenu === "Coupon_Management"
                ? "text-blue-500"
                : "text-gray-800"
                } hover:bg-gray-100`}
            >
              <RiCoupon2Fill className="mr-2" /> Coupon Management
              <KeyboardArrowDownIcon />
 
            </button>
            {openSubMenu === "Coupon_Management" && (
              <div className="pl-4">
                <NavLink
                  to="/coupons-list"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Coupon List
                </NavLink>
                <NavLink
                  to="/used-coupon-list"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Used Coupon List
                </NavLink>
                <NavLink
                  to="/expired-coupon"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Expired Coupon List
                </NavLink>
              </div>
            )}
 
         
 
 
            <button
              onClick={() => toggleSubMenu("product_Management")}
              className={`flex items-center w-full text-left py-2 ${openSubMenu === "product_Management"
                ? "text-blue-500"
                : "text-gray-800"
                } hover:bg-gray-100`}
            >
              <AiFillProduct className="mr-2" /> Product Management
              <KeyboardArrowDownIcon />
 
            </button>
            {openSubMenu === "product_Management" && (
              <div className="pl-4">
                <NavLink
                  to="/add-coupon-product"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaPlusSquare className="mr-2" /> Add Product
                </NavLink>
 
              </div>
            )}
 
          </div>
        )} */}

        {/* Role / Staff Management */}
        {/* <button
          onClick={() => toggleMenu("roleStaff")}
          className={`flex items-center w-full text-left py-2 ${openMenu === "roleStaff" ? "text-blue-500" : "text-gray-800"
            } hover:bg-gray-100 font-medium`}
        >
          <FaUserShield className="mr-2" />
          Role / Staff Management
          <KeyboardArrowDownIcon />
        </button> */}

        {openMenu === "roleStaff" && (
          <div className="pl-4">
            {/* Role Management */}
            <button
              onClick={() => toggleSubMenu("Role_Management")}
              className={`flex items-center w-full text-left py-2 ${openSubMenu === "Role_Management"
                ? "text-blue-500"
                : "text-gray-800"
                } hover:bg-gray-100`}
            >
              <FaUserTie className="mr-2" /> Role Management
              <KeyboardArrowDownIcon />

            </button>
            {openSubMenu === "Role_Management" && (
              <div className="pl-4">
                <NavLink
                  to="/add-role"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaPlusSquare className="mr-2" /> Add Role
                </NavLink>
                <NavLink
                  to="/role-list"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Role List
                </NavLink>
              </div>
            )}

            <button
              onClick={() => toggleSubMenu("Staff_Management")}
              className={`w-full text-left py-2 hover:bg-gray-100 flex items-center ${selectedSubMenu === "Staff_Management"
                ? "text-blue-500"
                : "text-gray-800"
                }`}
            >
              <FaUsers className="mr-2" /> Staff Management
              <KeyboardArrowDownIcon />

            </button>
            {openSubMenu === "Staff_Management" && (
              <div className="pl-4">
                <NavLink
                  to="/add-staff"
                  className={`w-full text-left py-2 hover:bg-gray-100 flex items-center ${selectedMenu === "/add-staff"
                    ? "text-blue-500"
                    : "text-gray-800"
                    }`}
                  onClick={() => setSelectedMenu("/add-staff")}
                >
                  <FaPlusSquare className="mr-2" /> Add Staff

                </NavLink>
                <NavLink
                  to="/staff-list"
                  className={`w-full text-left py-2 hover:bg-gray-100 flex items-center ${selectedMenu === "/staff-list"
                    ? "text-blue-500"
                    : "text-gray-800"
                    }`}
                  onClick={() => setSelectedMenu("/staff-list")}
                >
                  <FaListAlt className="mr-2" /> Staff List
                </NavLink>
              </div>
            )}
          </div>
        )}

      
        {openMenu === "Rule_Set" && (
          <div className="pl-4">
            <NavLink
              to="rclub/rule-set"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
              onClick={() => {
                setSelectedMenu("Rule_Set");
                setSelectedSubMenu("/rule-set");
              }}
            >
              <FaListAlt className="mr-2" /> Ruleset List
            </NavLink>
             
          </div>
        )}

        {/* transaction management */}
        <button
          onClick={() => toggleMenu("transaction")}
          className={`flex items-center w-full text-left py-2  ${openMenu === "transaction" ? "text-blue-500" : "text-gray-800"
            } hover:bg-gray-100 font-medium`}
        >
          <FaExchangeAlt className="mr-2" /> Transaction Management
          <KeyboardArrowDownIcon />
        </button>
        {openMenu === "transaction" && (
          <div className="pl-4">
            <NavLink
              to="rclub/transaction-management"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
              onClick={() => {
                setSelectedMenu("transaction");
                setSelectedSubMenu("/transaction-management");
              }}
            >
              <FaListAlt className="mr-2" /> Transaction List
            </NavLink>
          </div>
        )}
        {/* Customer Management */}
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
        {openMenu === "CustomerManagement" && (
          <div className="pl-4">
            <NavLink
              to="rclub/customer-list"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
              onClick={() => {
                setSelectedMenu("CustomerManagement");
                setSelectedSubMenu("/customer-list");
              }}
            >
              <FaListAlt className="mr-2" /> Customer List
            </NavLink>
          </div>
        )}

        
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

       
        {openMenu === "redeemManagement" && (
          <div className="pl-4">
            {/* E Voucher Management */}
            <button
              onClick={() => toggleSubMenu("EVoucher_Management")}
              className={`flex items-center w-full text-left py-2 ${openSubMenu === "EVoucher_Management"
                ? "text-blue-500"
                : "text-gray-800"
                } hover:bg-gray-100`}
            >
              <FaUserTie className="mr-2" /> E Voucher Management
              <KeyboardArrowDownIcon />

            </button>
            {openSubMenu === "EVoucher_Management" && (
              <div className="pl-4">
                <NavLink
                  to="/evoucher-gift-list"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> E Voucher & Gift List
                </NavLink>
              </div>
            )}

            {/*DS Product Management*/}

            <button
              onClick={() => toggleSubMenu("DSProduct_Management")}
              className={`flex items-center w-full text-left py-2 ${openSubMenu === "DSProduct_Management"
                ? "text-blue-500"
                : "text-gray-800"
                } hover:bg-gray-100`}
            >
              <FaUsers className="mr-2" /> DS Product Management
              <KeyboardArrowDownIcon />
            </button>
            {openSubMenu === "DSProduct_Management" && (
              <div className="pl-4">
                <NavLink
                  to="/ds-product-list"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> DS Product List
                </NavLink>
                 
              </div>
            )}
          </div>
        )}

        {/* Redeem History */}
        {/* <button
          onClick={() => toggleMenu("redeemHistory")}
          className={`flex items-center w-full text-left py-2 ${openMenu === "redeemHistory" ? "text-blue-500" : "text-gray-800"
            } hover:bg-gray-100 font-medium`}
        >
          <FaHistory className="mr-2" />
          Redeem History
          <KeyboardArrowDownIcon />

        </button> */}
        {openMenu === "redeemHistory" && (
          <div className="pl-4">
            {/* E Voucher */}
            <button
              onClick={() => toggleSubMenu("EVoucher")}
              className={`flex items-center w-full text-left py-2 ${openSubMenu === "EVoucher" ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`}
            >
              <FaUserTie className="mr-2" /> E Voucher
              <KeyboardArrowDownIcon />

            </button>
            {openSubMenu === "EVoucher" && (
              <div className="pl-4">
                <NavLink
                  to="/pending-request-list"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Pending Request List
                </NavLink>
                <NavLink
                  to="/reject-list"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Reject List
                </NavLink>
                <NavLink
                  to="/approve-list"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Approve List
                </NavLink>
                <NavLink
                  to="/zillion-transaction"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Zillion Transaction
                </NavLink>
              </div>
            )}

            {/* DS Product */}
            <button
              onClick={() => toggleSubMenu("DSProduct")}
              className={`flex items-center w-full text-left py-2 ${openSubMenu === "DSProduct" ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`}
            >
              <FaUsers className="mr-2" /> DS Product
              <KeyboardArrowDownIcon />
            </button>
            {openSubMenu === "DSProduct" && (
              <div className="pl-4">
                <NavLink
                  to="/product-redeem-list"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Order Redeem List
                </NavLink>
                {/* <NavLink
                  to="/order-shipment"
                  className={({ isActive }) =>
                    `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                    } hover:bg-gray-100`
                  }
                >
                  <FaListAlt className="mr-2" /> Order Shipment
                </NavLink> */}
              </div>
            )}
          </div>
        )}

         
        {openMenu === "Notification" && (
          <div className="pl-4">
            <NavLink
              to="/customer-reminder"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <SupportAgentIcon className="mr-2" />
              Customer
            </NavLink>
          </div>
        )}

        {/* Setting */}
        <button
          onClick={() => toggleMenu("Setting")}
          className={`flex items-center w-full text-left py-2 ${openMenu === "Setting" ? "text-blue-500" : "text-gray-800"
            } hover:bg-gray-100 font-medium`}
        >
          <FaCog className="mr-2" />
          Setting
          <KeyboardArrowDownIcon />

        </button>
        {openMenu === "Setting" && (
          <div className="pl-4">
            <NavLink
              to="/rclub/shopify"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaShopify className="mr-2" /> Shopify
            </NavLink>
            {/* <NavLink
              to="/notification"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <IoMdNotifications className="mr-2" /> Notification
            </NavLink> */}
          </div>
        )}

        {/* Gift Management */}

        {/* <button
          onClick={() => toggleMenu("gift_management")}
          className={`flex items-center w-full text-left py-2 ${openMenu === "gift_management" ? "text-blue-500" : "text-gray-800"
            } hover:bg-gray-100 font-medium`}
        >
          <FaGift className="mr-2" />
          Gift Management
          <KeyboardArrowDownIcon />

        </button> */}
        {openMenu === "gift_management" && (
          <div className="pl-4">
            <NavLink
              to="/add-activity"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaListAlt className="mr-2" /> Add Activity
            </NavLink>
            <NavLink
              to="/dispatch-activity"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaListAlt className="mr-2" /> Dispatch Activity
            </NavLink>

            <NavLink
              to="/import-activity"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaListAlt className="mr-2" /> Dispatch Gift
            </NavLink>

            <NavLink
              to="/dispatch-activity-details"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaListAlt className="mr-2" /> Dispatch Activity Details
            </NavLink>

            {/* <NavLink
              to="/pin-list"
              className={({ isActive }) =>
                `flex items-center w-full text-left py-2 ${isActive ? "text-blue-500" : "text-gray-800"
                } hover:bg-gray-100`
              }
            >
              <FaListAlt className="mr-2" /> Pin List
            </NavLink> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
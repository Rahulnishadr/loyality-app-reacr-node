import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import logo from "../assets/rajnigandha.png";
import logo from "../assets/etm2-300x277.png";
import { apiCall } from '../api/Api';
import Toast from '../reusable/Toast';
import { showPopup } from '../reusable/Toast';
import Person2Icon from '@mui/icons-material/Person2';
import { FaUserCircle, FaSignOutAlt, FaLock } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { HeaderContext } from "../reusable/HeaderContext"
function Header() {
  // Static values - no token decoding (avoids InvalidTokenError)
  const decoded = { id: "1", name: "User" };

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', oldPassword: '', newPassword: '', resetPassword: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  // const { selectedValue, setSelectedValue } = useContext(HeaderContext);

  const [userData, setUserData] = useState({
    profilePhoto: "",
    firstName: "",
    email: "",
    password: "",
    username: "",
  });


  const dropdownRef = useRef(null);

  // const handleChange = (e) => {
  //   localStorage.setItem('Values', e.target.value)
  //   let data = localStorage.getItem('Values')
  //   setSelectedValue(data);
  //   window.location.reload();
  //   <Navigate to="/login" replace />
  // };

  const handleResetPasswordClick = (e) => {
    e.stopPropagation();
    setIsReset(true);
    setIsDropdownOpen(false);
  };
  const handleProfileClick = (e) => {
    e.stopPropagation();
    setIsOpen(true);
    setIsDropdownOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiCall(`/auth/getById?id=${decoded?.id}`, "GET");
        if (response.status === 200) { 
          const apiData = response?.data;
          setUserData({
            profilePhoto: apiData?.profilePhoto || "",
            firstName: apiData?.name || "",
            username: apiData?.username || "",
            email: apiData?.email || "",
            password: apiData?.password || "",
          });
        } else {
          console.error("Failed to fetch user data:", response?.data?.message);
        }
      } catch (error) {
        if (error) {
          const { message, success } = error;

          if (success === false && message === 'Failed to authenticate token!') {
           localStorage.removeItem("token");
           localStorage.removeItem("Values");
           localStorage.removeItem("hastoken");
            // navigate('/login');
          } else {
            console.error('Other error:', data.message);
          }
        }

        showPopup("error", error?.message);
      }
    };

    fetchUserData();
  }, []);


  const handleUpdate = async () => {
    setIsLoading(true);
    const payload = {
      firstName: userData.firstName,
      username: userData.username,
    };

    try {
      const formData = new FormData();
      formData.append("profilePhoto", userData.profilePhoto);
      formData.append("payload", JSON.stringify(payload));

      const response = await apiCall("/auth/update?id=1", "PUT", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        showPopup("success", "Profile updated successfully");
        setIsOpen(false);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showPopup("error", "Failed to update profile");
      }
    } catch (error) {
      setIsLoading(false);
      showPopup("error", "Error updating profile.");
    }
  };


  const handleInputChangees = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [id]: value }));
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleClickOutside = (event) => {

    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (name === 'email' && value) {
        if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Email format is invalid';
        } else {
          delete newErrors.email;
        }
      }
      if (name === 'newPassword' && value) {
        if (value.length < 6) {
          newErrors.newPassword = 'Password must be at least 6 characters long';
        } else {
          delete newErrors.newPassword;
        }
      }
      if (name === 'resetPassword' && value) {
        if (value !== formValues.newPassword) {
          newErrors.resetPassword = 'Passwords do not match';
        } else if (value.length >= 6) {
          delete newErrors.resetPassword;
        }
      }
      return newErrors;
    });
  };

  const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const toggleDropdown = (event) => {
    event.stopPropagation()
    handleClickOutside(event)
  };

  const handleSignOut = async () => {
    try {
      const data = {};
      const response = await apiCall('/auth/logout', 'get', data);

      if (response.statusCode === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("Values");
        localStorage.removeItem("hastoken");
        showPopup("success", "Logout Successful");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      showPopup("error", error.message);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault()

    try {
      const payload = {
        email: formValues.email,
        oldPassword: formValues.oldPassword,
        password: formValues.newPassword,
        newPassword: formValues.resetPassword
      }

      const response = await apiCall('/auth/resetPass', 'POST', payload);

      if (response.status === 200) {
        setIsReset(false);
        localStorage.removeItem('token');
        showPopup('success', 'Password Reset Successfully');
        navigate('/login');
      }
    }
    catch (error) {
      showPopup('error', error?.message);
    }
  }


  const setIsResetFun = () => {
    setIsDropdownOpen(false)
    setIsReset(false)
  }
  const data = { roles: "admin" };

  return (

    <div className="flex justify-between items-center border-b border-gray-300 px-6 py-1.5 bg-white shadow-md" onClick={toggleDropdown}>
      {/* Left: Logo */}
      <Link to="/" className="font-bold text-2xl text-blue-600">
        <img className='w-40 h-16' alt='logo' src={logo}></img>
      </Link>

      {/* Center: Select Dropdown */}
      
      <div className="flex items-center space-x-4" onClick={handleClickOutside}>
        {/* {data?.roles === "admin" ? <></> : <>
          <select
            value={selectedValue}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rclub">rclub</option>
            <option value="rajnigandha">rajnigandha</option>
          </select>
        </>} */}


        {/* User Icon and Dropdown */}
        <div className="relative">
          <div className="flex items-center cursor-pointer" onClick={() => setIsDropdownOpen((prev) => !prev)}
          >

            <FaUserCircle className="text-2xl" />
            <span className="ml-2 font-semibold">{decoded?.name}</span>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef} // Attach the ref to the dropdown container
              className="absolute z-50 right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-md"
            >
              <ul>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt className="mr-2" />
                  <span>Sign out</span>
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleResetPasswordClick}
                >
                  <FaLock className="mr-2" />
                  <span>Reset Password</span>
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  // onClick={() => setIsOpen(true)}>
                  onClick={handleProfileClick}>
                  <Person2Icon className="mr-2" />
                  <span>Profile</span>
                </li>
              </ul>
            </div>
          )}

          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-1/2 px-6 py-8 rounded-lg shadow-lg relative">
                {/* Close Button */}
                <button
                  className="absolute top-2 right-3 text-red-500 hover:text-red-600 text-4xl"
                  onClick={() => setIsOpen(false)}
                >
                  &times;
                </button>

                {/* User Profile */}
                <div className="text-center">
                  {/* Profile Photo */}
                  <div className="mb-6">
                    <div className="flex justify-center gap-4">
                      <div className="relative w-24 h-24">
                        <img
                          src={userData.profilePhoto || "https://cdn.i.haymarketmedia.asia/?n=campaign-india%2fcontent%2frajnigandha.jpg&h=570&w=855&q=100&v=20170226&c=1"}
                          alt="Profile Preview"
                          className="w-24 h-24 rounded-full object-cover border border-gray-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 rounded-full opacity-0 hover:opacity-100 transition duration-200 cursor-pointer">
                          <label
                            htmlFor="profilePhoto"
                            className="text-white text-sm bg-gray-800 px-2 py-1 rounded hover:bg-gray-700"
                          >
                            Change
                          </label>
                        </div>
                      </div>
                      <input
                        type="file"
                        id="profilePhoto"
                        className="hidden"
                      />
                    </div>
                    <label htmlFor="profilePhoto" className="block mb-2 text-gray-700 font-medium">
                      Profile Photo
                    </label>
                  </div>

                  {/* First Name and Last Name */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 justify-start">
                      <label htmlFor="firstName" className="block text-gray-700 font-medium ml-3">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={userData.firstName}
                        onChange={handleInputChangees}
                        className="w-full p-2 border rounded-lg bg-gray-100"
                      />
                    </div>
                    <div className="flex-1 justify-start">
                      <label htmlFor="lastName" className="block text-gray-700 font-medium ml-3">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={userData.username}
                        onChange={handleInputChangees}
                        className="w-full p-2 border rounded-lg bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Email and Password */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="email" className="block text-gray-700 font-medium ml-3">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userData.email}
                        readOnly
                        className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="password" className="block text-gray-700 font-medium ml-3">
                        Password
                      </label>
                      <input
                        type="text"
                        id="password"
                        value={userData.password}
                        onChange={handleInputChangees}
                        className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    className={`w-28 py-2 rounded-lg text-white ${isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    onClick={handleUpdate}
                    disabled={isLoading} // Disable button while loading
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          )}


          {isReset && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="mx-auto w-1/3 p-6 bg-white shadow-md rounded-md border border-gray-300">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Reset Password</h2>
                  <button className="bg-red-500 px-3 py-1 text-white rounded-md" onClick={setIsResetFun}>
                    X
                  </button>
                </div>

                <form className="mt-4">
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                    Enter email<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    value={formValues.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

                  <label className="block text-gray-700 font-medium mt-4 mb-1" htmlFor="old-password">
                    Old Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      id="old-password"
                      name="oldPassword"
                      placeholder="Enter old password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={formValues.oldPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={toggleOldPasswordVisibility}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showOldPassword ? <Visibility /> : <VisibilityOff />}
                    </button>
                  </div>

                  <label className="block text-gray-700 font-medium mt-4 mb-1" htmlFor="new-password">
                    New password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="new-password"
                      name="newPassword"
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={formValues.newPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </button>
                  </div>
                  {formErrors.newPassword && <p className="text-red-500 text-sm">{formErrors.newPassword}</p>}

                  <label className="block text-gray-700 font-medium mt-4 mb-1" htmlFor="confirm-password">
                    Confirm password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password"
                      name="resetPassword"
                      placeholder="Enter confirm password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={formValues.resetPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </button>
                  </div>
                  {formErrors.resetPassword && <p className="text-red-500 text-sm">{formErrors.resetPassword}</p>}

                  <button
                    className="mt-6 w-1/3 float-right py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-600"
                    type="submit"
                    onClick={handleResetPassword}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <Toast />
      </div>
    </div>

  );
}

export default Header;

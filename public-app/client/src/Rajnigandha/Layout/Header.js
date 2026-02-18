import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/rajnigandha.png"
import { apiCall } from '../../api/Api';
import { useNavigate,Navigate } from 'react-router-dom';
import { showToast } from '../../reusable/Toast';
import { FaUserCircle, FaSignOutAlt, FaLock } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const [formValues, setFormValues] = useState({ email: '', newPassword: '', resetPassword: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {

    try {
      const data = {};
      const response = await apiCall('/login/logout', 'get', data);

      if (response.statusCode === 200) {
        showToast("Logout Successful", "success")
        localStorage.removeItem("token");
        // alert('ok')
        <Navigate to="/login" replace />
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    }
    catch (error) {
      
    }
  }

  return (
    <div className="flex justify-between items-center border-b border-gray-300 px-6 py-1.5 bg-white shadow-md">
      {/* Left: Logo */}
      <Link to="/" className="font-bold text-2xl text-blue-600">
        <img className='w-40 h-16' alt='logo' src={logo}></img>
      </Link>

      <div className="relative">
        <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
          <span className="mr-2 font-semibold">Super Admin</span>
          <FaUserCircle className="text-2xl" />
        </div>

        {/* {/ Dropdown /} */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-md">
            <ul>
              <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleSignOut}>
                <FaSignOutAlt className="mr-2" />
                <span>Sign out</span>
              </li>
              <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <FaLock className="mr-2" />
                <span onClick={() => setIsReset(true)}>Reset Password</span>
              </li>
            </ul>
          </div>
        )}

        {isReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="mx-auto w-1/3 p-6 bg-white shadow-md rounded-md border border-gray-300">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Reset Password</h2>
                <button className="bg-red-500 px-3 py-1 text-white rounded-md" onClick={() => setIsReset(false)}>
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
                    {showNewPassword ? <Visibility /> : <VisibilityOff /> }
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
                  className="mt-6 w-1/3 float-right py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;



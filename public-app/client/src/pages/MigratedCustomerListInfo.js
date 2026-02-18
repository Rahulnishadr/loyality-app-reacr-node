import React, { useEffect,useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import welcome from "../assets/welcome.png";
import memberblue from "../assets/memberblue.png"
import silvernew from "../assets/silvernew.png";
import tierGold from "../assets/tierGold.png";
import PltCard from "../assets/PltCard.png"
 import { apiCall } from '../api/Api';
import LoaderSpiner from '../reusable/LoaderSpiner';
 import { HeaderContext } from "../reusable/HeaderContext"
import { HTTP_METHODS } from '../reusable/constants';


function MigratedCustomerListInfo() {
      const { selectedValue } = useContext(HeaderContext);
     const [showLoader, setShowLoader] = useState(false);
    const [membershipLevel, setMembershipLevel] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { firstName, lastName, accountId, balance_point, membershipTier, mobileNo, email, pinCode } = location.state || {};

    const handleBackClick = () => navigate('/migrated-customer');
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    

    const formatExpiryDate = (date) => {
        const regex = /^(\d{2})-(\d{2})-(\d{4})$/;

        if (regex.test(date)) {
            // Extract day, month, and year using the regex
            const [, day, month, year] = date.match(regex);
            return `${day}/${month}/${year}`;
        }

        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
            const day = String(parsedDate.getDate()).padStart(2, '0');
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = parsedDate.getFullYear();
            return `${month}/${day}/${year}`;
        }

        return date;
    };

    const getStyles = (membershipTier) => {
        
        switch (membershipTier) {
            case 'welcome':
                return {
                    backgroundImage: `url(${welcome})`,
                    textColor: 'text-white',
                };
            case 'blue':
                return {
                    backgroundImage: `url(${memberblue})`,
                    textColor: 'text-black',
                };
            case 'silver':
                return {
                    backgroundImage: `url(${silvernew})`,
                    textColor: 'text-black',
                };
            case 'gold':
                return {
                    backgroundImage: `url(${tierGold})`,
                    textColor: 'text-black',
                };
            case 'platinum':
                return {
                    backgroundImage: `url(${PltCard})`,
                    textColor: 'text-white',
                };
            default:
                return {
                    backgroundImage: 'url(/path-to-default-image.jpg)',
                    textColor: 'text-black',
                };
        }
    };


    useEffect(() => {
        const fetchCustomerData = async () => {
            setShowLoader(true)
            try {
                const response = await apiCall(`/script/migratedCustomerTransactions?store=${selectedValue}&account_number=${accountId}`, HTTP_METHODS.GET, { });
                if (response.status === 200) {
                    setShowLoader(false)
                    setTransactions(response?.transactions || []);
                    // setName(((firstName === null ? "" : firstName) + " " + (lastName === null ? "" : lastName)));
                    setMembershipLevel(response?.customer?.membership_tier);
                }
            } catch (error) {
                setShowLoader(false)
                // console.error('Error fetching data:', error);
            }
        };

        if (accountId) {
            fetchCustomerData();
        }
    }, [accountId]);

    return (
        <div className="w-full mx-auto p-8 shadow-md">
            {showLoader && <LoaderSpiner text="Loading ..." />}
            <div className='flex gap-4 mb-4'>
                <button
                    className='px-2 py-1 rounded-md text-xl'
                    onClick={handleBackClick}
                >
                    <span className='flex items-center justify-center'><IoIosArrowBack /> Back</span>
                </button>
                {/* <h1 className='text-2xl'>{name}</h1> */}
            </div>

            {/* <div className='flex gap-5'> */}
            <div className="w-full bg-white rounded-lg shadow-md p-6">
                <div
                    className="p-4 rounded-lg text-white text-sm text-start flex flex-col justify-center"
                    style={{
                        backgroundImage: getStyles(membershipTier).backgroundImage,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '270px',
                        width: '420px',
                    }}
                >
                    <div className={`font-xs ml-10 mt-14 ${getStyles(membershipTier).textColor}`}>
                        <h3 className="text-left md:text-lg font-semibold mr-4 mt-2 md:mt-4">
                            {membershipLevel} 
                            {firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : ''} {lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : ''}
                        </h3>
                        <p className="mb-1">A/C Number: {accountId}</p>
                        <p className="mb-1">A/C Balance: {balance_point}</p>
                        <p className="mb-1">
                         Membership Level: {membershipTier ? membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1) : ''}
                        </p>

                        <p className="mb-1">Contact No: {mobileNo}</p>
                        <p className="mb-1">Email: {email}</p>
                        <p className="mb-1">Pincode: {pinCode}</p>
                    </div>
                </div>
            </div>



            {/* </div> */}

            <div className="w-full mx-auto p-4 shadow-md mt-4">
                <div className="flex justify-between items-center mb-4 w-full">
                    <h1 className="text-2xl font-normal">Top Five Transactions</h1>
                    <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        All Transactions
                    </button>
                    {showModal && (
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
                        // onClick={closeModal} 
                        >
                            <div className="bg-white w-[94%] mx-auto p-8 shadow-md rounded-lg max-h-[85%]">
                                <div className="flex justify-between items-center mb-4 w-full">
                                    <h1 className="text-2xl font-normal">All Transactions List</h1>
                                    <button onClick={closeModal} className="text-red-500 text-4xl">&times;</button>
                                </div>
                                {/* <div className="overflow-x-auto overflow-y-auto w-full" style={{ maxHeight: '400px' }}> */}
                                <div className="overflow-y-auto overflow-x-auto w-full h-96">
                                    <table className="w-full table-auto border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100 border-b h-12">
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Sr. No</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Transaction Id</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Account Number</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Order Id</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Category</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Medium</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Point</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Status</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Expiry Date</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Store</th>
                                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Transaction Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.length > 0 ? (
                                                transactions.map((transaction, index) => (
                                                    <tr key={transaction?.id} className="border-b hover:bg-gray-50 h-12">
                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{index + 1}</td>
                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.transition_id}</td>
                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.account_number}</td>
                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.order_id}</td>
                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.transition_category}</td>
                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.medium}</td>
                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.point}</td>
                                                        <td
                                                            className={`px-2 border-r text-sm whitespace-nowrap text-left ${transaction?.transition_status === 'register'
                                                                ? 'text-blue-500'
                                                                : transaction?.transition_status === 'credit'
                                                                    ? 'text-green-500' : transaction?.transition_status === 'hold' ? 'text-yellow-500'
                                                                        : 'text-red-500'
                                                                }`}
                                                        >
                                                            {transaction?.transition_status === "hold" ? "upcoming" : transaction?.transition_status}
                                                        </td>
                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">

                                                            {/* {transaction.expiry_date ? formatExpiryDate(transaction.expiry_date) : ''} */}
                                                            {transaction?.point === '0' || transaction?.transition_status == 'debit' || transaction?.transition_status == 'redeem' || (transaction?.transition_status == 'debit' && transaction?.transition_status == 'redeem') ? "" : formatExpiryDate(transaction.expiry_date)}



                                                        </td>



                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">
                                                            {transaction?.store}
                                                        </td>
                                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">
                                                            {transaction?.createdAt
                                                                ? new Date(transaction?.createdAt)
                                                                    .toLocaleDateString('en-GB', {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric',
                                                                    }) +
                                                                ', ' +
                                                                new Date(transaction?.createdAt).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit',
                                                                    hour12: false, // Ensures 24-hour format
                                                                })
                                                                : ''}
                                                        </td>

                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="11" // Number of columns in your table
                                                        className="text-center text-red-500 py-4"
                                                    >
                                                        No data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="overflow-y-auto overflow-x-auto w-full h-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 border-b h-12">
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Sr. No</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Transaction Id</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Account Number</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Order Id</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Category</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Medium</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Point</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Status</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Expiry Date</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Store</th>
                                <th className="px-2 py-2 border-r font-medium text-left whitespace-nowrap">Transaction Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.slice(0, 5).map((transaction, index) => (
                                    <tr key={transaction?.id} className="border-b hover:bg-gray-50 h-12">
                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{index + 1}</td>
                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.transition_id}</td>
                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.account_number}</td>
                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.order_id}</td>
                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.transition_category}</td>
                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.medium}</td>
                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">{transaction?.point}</td>
                                        <td
                                            className={`px-2 border-r text-sm whitespace-nowrap text-left ${transaction?.transition_status === "register"
                                                ? "text-blue-500"
                                                : transaction?.transition_status === "credit"
                                                    ? "text-green-500"
                                                    : transaction?.transition_status === "hold"
                                                        ? "text-yellow-500"
                                                        : "text-red-500"
                                                }`}
                                        >
                                            {transaction?.transition_status === "hold" ? "upcoming" : transaction?.transition_status}
                                        </td>
                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">
                                            {transaction?.point === '0' || transaction?.transition_status == 'debit' || transaction?.transition_status == 'redeem' || (transaction?.transition_status == 'debit' && transaction?.transition_status == 'redeem') ? "" : formatExpiryDate(transaction?.expiry_date)}

                                            {/* {transaction.expiry_date ? formatExpiryDate(transaction.expiry_date) : ''} */}
                                        </td>


                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">
                                            {transaction?.store}
                                        </td>
                                        <td className="px-2 border-r text-sm whitespace-nowrap text-left">
                                            {transaction?.createdAt
                                                ? new Date(transaction?.createdAt)
                                                    .toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    }) +
                                                ', ' +
                                                new Date(transaction?.createdAt).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false, 
                                                })
                                                : ''}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="11" // Number of columns in your table
                                        className="text-center text-red-500 py-4"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MigratedCustomerListInfo;
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import ExportDropdown from '../reusable/Export_to_excel';


const OrderShipment = () => {
  const [transactions] = useState([
  ]);



  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 15;

  // Calculate the indices of the first and last tags to display for the current page
  const indexOfLast = currentPage * tagsPerPage;
  const indexOfFirst = indexOfLast - tagsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(transactions.length / tagsPerPage);

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Order Shipment List</h1>
        <div className="relative">
          <ExportDropdown data={transactions} filename="Product_Redeem_List" />
        </div>

      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left border-b h-12">
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Sr. No</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Account Number</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Name</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Contact No.</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Used Points</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Quantity</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Order ID</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">AWB ID</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Transaction Id</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Shipping Address</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Country</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">State</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">City</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Pin Code</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Payment Mode</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Billing Address</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Courier Partner</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Shipment Status</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Order Date</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Track Order</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions && currentTransactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={transaction.transactionId} className="border-b text-sm text-left font-medium hover:bg-gray-50 h-12">
                  <td className="px-2 border-r whitespace-nowrap">{index + 1}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.recipientName}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.state}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.city}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.country}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.phone}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.orderId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.awbId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.transactionId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.address}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.paymentMode}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.pointsUsed}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.quantity}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.sellerAddress}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.points}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.payBy}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.sellerPinCode}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.shipmentStatus}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.status}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction.courierPartner}</td>
                  <td className="px-2 border-r whitespace-nowrap">
                    {new Date(transaction.createdAtIst).toLocaleString()}
                  </td>
                  <td className="p-3 border-r  whitespace-nowrap">

                    <NavLink to={`/order-shipment/${transaction.orderId}/${transaction.awbId}`}>
                      <button className='bg-sky-500 text-white text-sm p-2 rounded'>
                        Track Order
                      </button>
                    </NavLink>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="22" className="p-2 text-center text-red-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-end items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed me-2' : 'bg-blue-600 text-white me-2'}`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed ms-2' : 'bg-blue-600 text-white ms-2'}`}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default OrderShipment


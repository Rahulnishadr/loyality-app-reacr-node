import React, { useEffect, useContext, useState } from 'react'
import 'jspdf-autotable';
import { apiCall } from '../api/Api';
import LoaderSpiner from '../reusable/LoaderSpiner';
import ExportDropdown from '../reusable/Export_to_excel';
import { HeaderContext } from "../reusable/HeaderContext"
import { showPopup } from '../reusable/Toast';
import { API_URLS, HTTP_METHODS, HTTP_RESPONSE } from '../reusable/constants';
const ZillionList = () => {
  const { selectedValue } = useContext(HeaderContext);
  const [showLoader, setShowLoader] = useState(false);
  const [transactions, setTransaction] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 15;

  const indexOfLast = currentPage * tagsPerPage;
  const indexOfFirst = indexOfLast - tagsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(transactions.length / tagsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getZillionList = async () => {
    setShowLoader(true)
    API_URLS.ZILLION_LIST
    try {
      const response = await apiCall(API_URLS.ZILLION_LIST.getZillionList + selectedValue, HTTP_METHODS.GET, {});

      if (response.status === HTTP_RESPONSE.SUCCESS) {
        setShowLoader(false)
        
        const data = response?.data.map((item) => (
          {
            id: 1,
            orderId: item?.orderId || '',
            orderProductId: item?.orderProductId || '',
            customerId: item?.customerId || '',
            customerName: item?.shippingFirstname !== null && item?.shippingLastname !== null ? `${item?.shippingFirstname} ${item?.shippingLastname}` : '',
            partner: '',
            partnerUserId: item?.partnerId || '',
            mobile: item?.telephone || '',
            email: item?.email || '',
            orderReferenceId: "",
            orderDate: item?.date
              ? new Date(item?.date)
                .toISOString()
                .split("T")[0]
                .split("-")
                .reverse()
                .join("-")
              : "",
            invoiceNo: "",
            itemCode: "",
            productName: item?.name || '',
            denomination: "",
            quantity: item?.quantity,
            discount: '',
            totalAmount: item?.totalPrice || '',
            status: item?.isVoucher ? 'Voucher Data' : 'Physical Data',
            vendorOrderReferenceId: "",
            pointUsed: item?.pointUsed || '',
            partnerOrderNumber: item?.partnerOrderNumber || '',
            pointStatus: '',
            transactionId: item?.transactionId || '',
          }
        ))
        setTransaction(data)
      }
    }
    catch (error) {
      setShowLoader(false)
      showPopup('error', error.message);
    }finally{
      setShowLoader(false);
    }
  }

  useEffect(() => {
    getZillionList();
  }, [selectedValue])

  const headers = {
    id: "Id",
    orderId: "Order Id",
    orderProductId: "Order Product Id",
    customerId: "Customer Id",
    customerName: "Customer Name",
    partner: "Partner",
    partnerUserId: "Partner User Id",
    mobile: "Mobile No.",
    email: "Email",
    orderReferenceId: "Order Reference Id",
    orderDate: "Order Date",
    invoiceNo: "Invoice No",
    itemCode: "Item Code",
    productName: "Product Name",
    denomination: "Denomination",
    quantity: "Quantity",
    discount: "Discount",
    totalAmount: "Total Amount",
    status: "Status",
    vendorOrderReferenceId: "Vendor Order Reference Id",
    pointUsed: "Point Used",
    partnerOrderNumber: "Partner Order Number",
    pointStatus: "Point Status",
    transactionId: "Transaction Id",
  }

  const columns = [
    "id",
    "orderId",
    "orderProductId",
    "customerId",
    "customerName",
    "partner",
    "partnerUserId",
    "mobile",
    "email",
    "orderReferenceId",
    "orderDate",
    "invoiceNo",
    "itemCode",
    "productName",
    "denomination",
    "quantity",
    "discount",
    "totalAmount",
    "status",
    "vendorOrderReferenceId",
    "pointUsed",
    "partnerOrderNumber",
    "pointStatus",
    "transactionId",
  ];

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium">Zillion Transaction List</h1>
        <div className="relative">
          <ExportDropdown
            data={transactions.map((item, index) => ({
              ...item,
              srno: index + 1,
            }))}
            filename="Zillion_List"
            columns={columns}
            headers={headers}
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left border-b h-12">
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Sr. No</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Order Id</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Order Product Id</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Customer Id</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Customer Name</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Partner</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Partner User Id</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Mobile No.</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Email</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Order Reference Id</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Order Date</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Invoice No</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Item Code</th> {/* Added Item Code */}
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Product Name</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Denomination</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Quantity</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Discount</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Total Amount</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Status</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Vendor Order Reference Id</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Point Used</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Partner Order Number</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Point Status</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Transaction Id</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions && currentTransactions.length > 0 ? (
              currentTransactions.map((transaction, index) => (
                <tr key={transaction.id} className="border-b font-medium text-sm text-left hover:bg-gray-50 h-12">
                  <td className="px-2 border-r whitespace-nowrap">{indexOfFirst + index + 1}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.orderId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.orderProductId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.customerId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.customerName}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.partner}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.partnerUserId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.mobile}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.email}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.orderReferenceId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.orderDate}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.invoiceNo}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.itemCode}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.productName}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.denomination}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.quantity}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.discount}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.totalAmount}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.status}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.vendorOrderReferenceId}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.pointUsed}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.partnerOrderNumber}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.pointStatus}</td>
                  <td className="px-2 border-r whitespace-nowrap">{transaction?.transactionId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="p-2 text-center text-red-500">
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

export default ZillionList

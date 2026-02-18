import React, { useState } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Toast from "./Toast";
// import { showPopup } from "./Toast";
import { HTTP_METHODS } from "../reusable/constants";
// import "jspdf-autotable";
import { apiCall } from "../api/Api";
// import LoaderSpiner from "./LoaderSpiner";

// const formatDate = (date) => {
//   if (date instanceof Date) {
//     const day = ("0" + date.getDate()).slice(-2);
//     const month = ("0" + (date.getMonth() + 1)).slice(-2);
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   }
//   return date;
// };

const ExportDropdown = ({ url,status,filterStartDate,filterStartEnd, columns, headers, setShowLoader }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showExportPopup, setShowExportPopup] = useState(false);

  // const [showLoader, setShowLoader] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  };

  const reusableFunction = (data) => {
    if(status=='customerList'){
      const customerList = data.map((item) => ({
        id: item?.id,
        accountId: item?.account_number,
        firstName: item?.first_name,
        lastName: item?.last_name,
        customerId: item?.customer_id,
        mobileNo: item?.phone_number,
        alternateMobileNo: "",
        email: item?.email,
        date_of_birth: item?.date_of_birth
          ? (() => {
            const [year, month, day] = item.date_of_birth.split("-");
            return `${day}/${month}/${year}`;
          })()
          : "",
        earned_point: parseInt(item?.earned_point, 10),
        redeem_point: parseInt(item?.redeem_point, 10),
        expiry_point: parseInt(item?.expiry_point, 10),
        balance_point: parseInt(item?.balance_point, 10),
        State: item?.State,
        city: item?.city,
        country: item?.country,
        Distrtict: item?.Distrtict,
        pinCode: item?.zip,
        membershipTier: item?.membership_tier,
        addressLine1: item?.address1,
        addressLine2: item?.address2,
        notification: "",
        membershipStatus: item?.membership_status,
        registrationDate: item?.registration_date
          ? (() => {
            const date = new Date(item?.registration_date);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          })()
          : "",
        registrationTime: item?.registration_time,
      }));
      return customerList
    }else if(status=='transition'){
      const formattedData = data?.map((transaction) => ({
        id: transaction?.id,
        transactionId: transaction?.transition_id,
        category: transaction?.transition_category,
        accountId: transaction?.account_number,
        customerId: transaction?.customer_Id,
        transaction_Medium: transaction?.medium,
        store: transaction?.store,
        point: transaction?.point,
        status: transaction?.transition_status,
        transactionType: transaction?.transactionType,
        registrationDate: transaction?.createdAt
          ? `${String(new Date(transaction?.createdAt).getDate()).padStart(2, '0')}/${String(new Date(transaction?.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(transaction.createdAt).getFullYear()}`
          : '',
        expiryDate: transaction?.expiry_date
          ? transaction?.expiry_date.split('-').join('/')
          : '',
        transactionTime: transaction?.createdAt
          ? `${String(new Date(transaction?.createdAt).getDate()).padStart(2, '0')}/${String(new Date(transaction?.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(transaction.createdAt).getFullYear()}, ${String(new Date(transaction.createdAt).getHours()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getMinutes()).padStart(2, '0')}:${String(new Date(transaction.createdAt).getSeconds()).padStart(2, '0')}`
          : '',
        orderId: transaction?.order_id,
        productDetails: transaction?.product_detail,
        name: transaction?.name,
        mobile_no: transaction?.mobile_no,
        state: transaction?.state,
        city: transaction?.city,
        couponCode: transaction?.coupon_code,
        scanManual: transaction?.scan_manual,
        serialNo: transaction?.serial_no,
  
      }));
      return formattedData
    }
  
  }

  const handleMultipleExport = async (fileType) => {
    setShowLoader(true);
    let allData = [];
    let page = 1;
    let totalRecords = 0;
    let fetchedRecords = 0;
    let again = 0;
    let fileCounter = 1;

    try {
      do {
        const data = { again: `${again}`,start_date:filterStartDate,end_date:filterStartEnd, page_no: `${page}` };

        const response = await apiCall(`${url}`, HTTP_METHODS.POST, data);

        if (response?.status) {
          const result = reusableFunction(response?.data)
          // setTotalPages(response?.totalPages);
          // setTransactions(result);

          allData = [...allData, ...result];
          fetchedRecords += response.data.length;

          if (!totalRecords) {
            totalRecords = response?.total;
          }


          if (again === 0) {
            again = 1;
            page = 1;
          } else {
            page++;
          }

          while (allData.length >= 30000) {
            const fileName = `${status}${fileCounter}`;
            exportDropdown(allData.slice(0, 30000), fileName, columns, headers, fileType);
            allData = allData.slice(30000);
            fileCounter++;
          }

        } else {

          break;
        }
      } while (fetchedRecords < totalRecords);

      if (allData.length > 0) {
        const fileName = `${status}${fileCounter}`;
        exportDropdown(allData, fileName, columns, headers,fileType);
        setShowExportPopup(false);
      }

    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setShowLoader(false);
    }
  };
  const formatExcel = (date) => {
    if (date instanceof Date) {
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (typeof date === 'string') {
      if (/^\d{4}-\d{2}-\d{2}/.test(date)) { // yyyy-mm-dd
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
          const day = ("0" + parsedDate.getDate()).slice(-2);
          const month = ("0" + (parsedDate.getMonth() + 1)).slice(-2);
          const year = parsedDate.getFullYear();
          return `${day}/${month}/${year}`;
        }
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) { // dd-mm-yyyy
        const [day, month, year] = date.split('-');
        if (!isNaN(new Date(`${year}-${month}-${day}`))) {
          return `${day}/${month}/${year}`;
        }
      }
    }
    return date;
  };
  const exportDropdown = (data, filename, columns, headers, fileType) => {
    if (fileType == "excel") {
      const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        worksheet.columns = [{ header: "Sr. No", width: 10 }, ...Object.values(headers).map((header) => ({
          header,
          width: 15,
        }))];

        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF42ACED" },
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
        data.forEach((item, index) => {
          const row = [index + 1, ...columns.map((col) => formatExcel(item[col]))];
          const newRow = worksheet.addRow(row);

          newRow.eachCell((cell) => {
            cell.alignment = { horizontal: "center" };
          });
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: "application/octet-stream" });
          saveAs(blob, `${filename}.xlsx`);
        });
      };
      exportToExcel()
    }
    else {
      const exportToPDF = () => {
        const doc = new jsPDF("landscape", "pt", "A2");

        // Set the title font size and position
        doc.setFontSize(18);

        // Get dynamic headers from `headers` object
        const tableColumnHeaders = Object.values(headers);

        // Check if data is empty
        if (!data || data.length === 0) {
          // Add the table header only
          doc.autoTable({
            head: [["Sr. No", ...tableColumnHeaders]], // Add "Sr. No" and dynamic headers
            body: [], // No data for rows
            startY: 25,
            styles: {
              fontSize: 10,
              cellPadding: 3,
              halign: "center", // Center-align content in cells
            },
            headStyles: {
              fillColor: [41, 128, 185], // Blue color
              textColor: [255, 255, 255], // White text
              fontSize: 12,
              halign: "center", // Center-align header content
            },
            tableLineWidth: 0.5, // Adding line width for borders
          });

          // Add "No data available" message in red color
          doc.setTextColor(255, 0, 0); // Set text color to red
          doc.setFontSize(14);
          doc.text("No data available to export.", doc.internal.pageSize.getWidth() / 2, doc.lastAutoTable.finalY + 20, { align: "center" });

          // Save the file
          doc.save(`${filename || "Table"}.pdf`);
          return;
        }

        // Map data to rows
        const tableRows = data.map((row, index) => [index + 1, ...columns.map((col) => row[col])]);

        // Add the table with data
        doc.autoTable({
          head: [["Sr. No", ...tableColumnHeaders]], // Add "Sr. No" and dynamic headers
          body: tableRows,
          startY: 25,
          styles: {
            fontSize: 10,
            cellPadding: 3,
            halign: "center", // Center-align content in cells
          },
          headStyles: {
            fillColor: [41, 128, 185], // Blue color
            textColor: [255, 255, 255], // White text
            fontSize: 12,
            halign: "center", // Center-align header content
          },
          alternateRowStyles: {
            fillColor: [242, 242, 242], // Light grey for even rows
          },
          tableLineWidth: 0.5, // Adding line width for borders
        });

        // Save the file
        doc.save(`${filename || "Table"}.pdf`);
      };
      exportToPDF()
    }
  };

  const ExportPopup = ({ onClose, fileType }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-lg font-medium mb-4">Export Customers</h2>
        <h2 className="text-sm mb-4">
          This export may take approximately 15-20 minutes. We appreciate your patience and understanding.
        </h2>
        <div className="flex gap-3">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={() => handleMultipleExport(fileType)}
          >
            Export to {fileType?.toUpperCase()}
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <Toast />
      <button
        onClick={toggleDropdown}
        // disabled={!data || data?.length === 0}
        // className={`${data?.length == 0 ? "bg-gray-500" : "bg-green-500"} text-white px-4 py-2 rounded`}
        className='bg-green-500 text-white px-4 py-2 rounded'
      >
        Export
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md z-10">
          <button
            onClick={() => {
              toggleDropdown();
              setShowExportPopup("pdf");
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Export to PDF
          </button>
          <button
            onClick={() => {
              toggleDropdown();
              setShowExportPopup("excel");
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Export to Excel
          </button>


        </div>
      )}
      {showExportPopup && (
        <ExportPopup
          onClose={() => setShowExportPopup(false)}
          fileType={showExportPopup}
        />
      )}
      {/* <ExportPopup
        onClose={() => setShowExportPopup(false)}
        fileType={showExportPopup}
      /> */}
    </div>
  );
};

export default ExportDropdown;
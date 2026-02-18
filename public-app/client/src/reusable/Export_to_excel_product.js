import React, { useState } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Toast from "./Toast";

const formatDate = (date) => {
  if (date instanceof Date) {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return date;
};

const ExportDropdown = ({ data, filename, headers }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // const exportToExcel = () => {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Sheet1");

  //   // Add "Sr. No" to the columns along with the dynamic headers
  //   worksheet.columns = [{ header: "Sr. No", width: 10 }, ...Object.values(headers).map((header) => ({
  //     header,
  //     width: 15,
  //   }))];

  //   // Style the header row
  //   worksheet.getRow(1).eachCell((cell) => {
  //     cell.font = { bold: true };
  //     cell.alignment = { horizontal: "center" };
  //     cell.fill = {
  //       type: "pattern",
  //       pattern: "solid",
  //       fgColor: { argb: "FF42ACED" }, // Header color (blue)
  //     };
  //     cell.border = {
  //       top: { style: "thin" },
  //       left: { style: "thin" },
  //       bottom: { style: "thin" },
  //       right: { style: "thin" },
  //     };
  //   });

  //   // Add rows of data with an index
  //   data.forEach((item, index) => {
  //     const row = [index + 1, ...columns.map((col) => formatDate(item[col]))]; // Add index to the row
  //     const newRow = worksheet.addRow(row);

  //     newRow.eachCell((cell) => {
  //       cell.alignment = { horizontal: "center" }; // Align cells to the left
  //     });
  //   });

  //   // Write the Excel file and download it
  //   workbook.xlsx.writeBuffer().then((buffer) => {
  //     const blob = new Blob([buffer], { type: "application/octet-stream" });
  //     saveAs(blob, `${filename}.xlsx`);
  //   });
  // };

 
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Define headers
    const tableColumnHeaders = Object.values(headers); 
    worksheet.columns = [{ header: "Sr. No", width: 10 }, ...tableColumnHeaders.map((header) => ({
      header,
      width: 15,
    }))];

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF42ACED" }, // Header color (blue)
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Process data
    let srNo = 1;
    data.forEach((row) => {
      const productKeys = Object.keys(row.product_name || {}); // Get product keys

      productKeys.forEach((key, productIndex) => {
        worksheet.addRow([
          srNo++, // Incrementing Sr. No for each product entry
          row.account_number,
          row.name,
          row.contact_no,
          row.email,
          row.order_id,
          row.order_name,
          row.product_name[key][`p${productIndex + 1}`] || "", // Product Name
          row.product_sku[key][`p${productIndex + 1}`] || "", // SKU

          Math.floor(Number(row.product_actual_point[key][`p${productIndex + 1}`])) || "", 
          row.product_quantity[key][`p${productIndex + 1}`] || "", // Quantity
          row.product_redeem_point[key][`p${productIndex + 1}`] || "",  
          productIndex === 0 ? row.billing_address : "", // Only first product
          productIndex === 0 ? row.pincode : "", // Only first pincode
          productIndex === 0 ? formatDate(new Date(row.redeem_date)) : "",
          row.state ,
          row.order_status ,
        ]);
      });
    });

    // Write the Excel file and download it
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, `${filename}.xlsx`);
    });
  };


  const exportToPDF = () => {
    const doc = new jsPDF("landscape", "pt", "A2");

    // Set the title font size and position
    doc.setFontSize(18);

    // Get dynamic headers from `headers` object
    const tableColumnHeaders = Object.values(headers);

    // Check if data is empty
    if (!data || data.length === 0) {
      doc.autoTable({
        head: [["Sr. No", ...tableColumnHeaders]],
        body: [],
        startY: 25,
        styles: { fontSize: 10, cellPadding: 3, halign: "center" },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontSize: 12, halign: "center" },
        tableLineWidth: 0.5,
      });

      doc.setTextColor(255, 0, 0);
      doc.setFontSize(14);
      doc.text("No data available to export.", doc.internal.pageSize.getWidth() / 2, doc.lastAutoTable.finalY + 20, { align: "center" });

      doc.save(`${filename || "Table"}.pdf`);
      return;
    }

    // Flatten product data for each row
    const tableRows = [];
    data.forEach((row, index) => {
      const productKeys = Object.keys(row.product_name || {}); // Get all product keys

      productKeys.forEach((key, productIndex) => {
        tableRows.push([
          index + 1, // Sr. No
          row.account_number,
          row.name,
          row.contact_no,
          row.email,
          row.order_id,
          row.order_name,
          row.product_name[key][`p${productIndex + 1}`] || "", // Product Name
          row.product_sku[key][`p${productIndex + 1}`] || "", // SKU 
          Math.floor(Number(row.product_actual_point[key][`p${productIndex + 1}`])) || "", 
          row.product_quantity[key][`p${productIndex + 1}`] || "", // Quantity 
          row.product_redeem_point[key][`p${productIndex + 1}`]|| "", 
          productIndex === 0 ? row.billing_address : "", // Only for first product
          productIndex === 0 ? row.pincode : "", // Only first pincode
          productIndex === 0 ? new Date(row.redeem_date).toLocaleDateString("en-GB") : "",
          row.state,
          row.order_status,
        ]);
      });
    });

    // Add the table with formatted data
    doc.autoTable({
      head: [["Sr. No", ...tableColumnHeaders]],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10, cellPadding: 3, halign: "center" },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontSize: 12, halign: "center" },
      alternateRowStyles: { fillColor: [242, 242, 242] },
      tableLineWidth: 0.5,
    });

    doc.save(`${filename || "Table"}.pdf`);
  };

  return (
    <div className="relative">
      <Toast />
      <button
        onClick={toggleDropdown}
        disabled={!data || data.length === 0}
        className={`${data.length == 0 ? "bg-gray-500" : "bg-green-500"} text-white px-4 py-2 rounded`}
      >
        Export
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md z-10">
          <button
            onClick={() => {
              exportToPDF();
              toggleDropdown();
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Export to PDF
          </button>
          <button
            onClick={() => {
              exportToExcel();
              toggleDropdown();
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
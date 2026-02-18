import React, { useState } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Toast from "./Toast";
import { showPopup } from "./Toast";

const formatDate = (date) => {
  if (date instanceof Date) {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return date;
};

const ExportDropdown = ({ data, filename, columns, headers }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => { 
    if (!data || data.length === 0) {
      showPopup("warning", "No data found to export.");
      return;
    }
    
    setIsDropdownOpen((prev) => !prev)
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add "Sr. No" to the columns along with the dynamic headers
    worksheet.columns = [{ header: "Sr. No", width: 10 }, ...Object.values(headers).map((header) => ({
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

    // Add rows of data with an index
    data.forEach((item, index) => {
      const row = [index + 1, ...columns.map((col) => formatDate(item[col]))]; // Add index to the row
      const newRow = worksheet.addRow(row);

      newRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center" }; // Align cells to the left
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
  
  return (
    <div className="relative">
      <Toast />
      <button
        onClick={toggleDropdown}
        disabled={!data || data?.length === 0}
        className={`${data?.length == 0 ? "bg-gray-500" : "bg-green-500"} text-white px-4 py-2 rounded`}
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
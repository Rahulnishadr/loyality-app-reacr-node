import React, { useState } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Toast from "./Toast";
// import { showPopup } from "./Toast";
import { HTTP_METHODS } from "./constants";
// import "jspdf-autotable";
import { apiCall } from "../api/Api";
 

const ExportDropdown = ({ url,filterStartDate,filterStartEnd, columns, headers, setShowLoader }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showExportPopup, setShowExportPopup] = useState(false);

  // const [showLoader, setShowLoader] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  };
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
        // const data = { again: `${again}`, page_no: `${page}` };
        const data = { again: `${again}`,start_date:filterStartDate,end_date:filterStartEnd, page_no: `${page}` };

        const response = await apiCall(`${url}`, HTTP_METHODS.POST, data);

        if (response?.status) {
          const result = response?.data
          // const result = reusableFunction(response?.data)
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

          while (allData.length >= 10000) {
            const fileName = `Product_List_Part${fileCounter}`;
            exportDropdown(allData.slice(0, 10000), fileName, columns, headers, fileType);
            allData = allData.slice(10000);
            fileCounter++;
          }

        } else {

          break;
        }
      } while (fetchedRecords < totalRecords);

      if (allData.length > 0) {
        const fileName = `Product_Part${fileCounter}`;
        exportDropdown(allData, fileName, columns, headers,fileType);
        setShowExportPopup(false);
      }

    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setShowLoader(false);
    }
  };
  const formatDate = (date) => {
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
     
        data.forEach((item, index) => {
          const row = [
            index + 1,
            ...columns.map((col) => {
              let value = item[col];
        
              // Flatten object like { p1: "..." } into "..."
              if (value && typeof value === "object" && !Array.isArray(value)) {
                value = Object.values(value).join(", ");
              }
        
              // Flatten array of objects like [{ p1: "..." }, { p2: "..." }] into "..., ..."
              if (Array.isArray(value)) {
                value = value
                  .map((v) =>
                    typeof v === "object" && v !== null
                      ? Object.values(v).join(", ")
                      : v
                  )
                  .join(", ");
              }
        
              // Remove decimals if the final value is a number string or number
              if (!isNaN(value)) {
                const num = Number(value);
                if (!isNaN(num)) {
                  value = Math.floor(num); // e.g., 500.00 → 500
                }
              }
        
              return formatDate(value);
            }),
          ];
        
          const newRow = worksheet.addRow(row);
          newRow.eachCell((cell) => {
            cell.alignment = { horizontal: "center" };
          });
        });
        
    
        
        // Write the Excel file and download it
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
        //  const tableRows = data.map((row, index) => [
        //   index + 1,
        //   ...columns.map((col) => {
        //     const value = row[col];
            
        //     if (typeof value === "object" && value !== null) {
        //       // If it's an array of objects or a single object, convert it to string
        //       return Array.isArray(value)
        //         ? value.map((item) => JSON.stringify(item)).join(", ")
        //         : JSON.stringify(value);
        //     }
        
        //     return value !== undefined && value !== null ? value : "";
        //   }),
        // ]);
        
        const tableRows = data.map((row, index) => [
          index + 1,
          ...columns.map((col) => {
            let value = row[col];
        
            // Handle object like { p1: "..." }
            if (value && typeof value === "object" && !Array.isArray(value)) {
              value = Object.values(value).join(", ");
            }
        
            // Handle array of objects like [{ p1: "..." }, { p2: "..." }]
            if (Array.isArray(value)) {
              value = value
                .map((v) =>
                  typeof v === "object" && v !== null
                    ? Object.values(v).join(", ")
                    : v
                )
                .join(", ");
            }
        
            // Remove decimal points if value is numeric (like 500.00 → 500)
            if (!isNaN(value)) {
              const num = Number(value);
              if (!isNaN(num)) {
                value = Math.floor(num);
              }
            }
            return formatDate(value !== undefined && value !== null ? value : "");
            // return value !== undefined && value !== null ? value : "";
          }),
        ]);
        
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
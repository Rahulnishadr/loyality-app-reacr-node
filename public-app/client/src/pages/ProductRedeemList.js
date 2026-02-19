import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import LoaderSpiner from '../reusable/LoaderSpiner';
import ExportDropdowns from '../reusable/Export_to_excel';
import ExportDropdown from '../reusable/ExportToProductList';
import { apiCall } from '../api/Api';
import { useEffect, useContext } from 'react';
import Filter from '../reusable/Filter';
import { showPopup } from '../reusable/Toast';
import autoTable from 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { HeaderContext } from '../reusable/HeaderContext';
import { API_URLS, HTTP_METHODS, HTTP_RESPONSE } from '../reusable/constants';
import msg from '../reusable/msg.json'
const ProductRedeemList = () => {


  const { selectedValue } = useContext(HeaderContext);

  const [showLoader, setShowLoader] = useState(false);
  const [reedeemList, setRedeemList] = useState([]);
  const [search, setSearch] = useState('');

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showZipPopup, setShowZipPopup] = useState(false);

  const [formState, setFormState] = useState({
    startDate: "",
    endDate: "",
    status: "",
    brandName: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 15;

  // Calculate the indices of the first and last tags to display for the current page
  const indexOfLast = currentPage * tagsPerPage;
  const indexOfFirst = indexOfLast - tagsPerPage;
  const currentreedeemList = reedeemList?.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(reedeemList.length / tagsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
    setShowLoader(false)
  };
  const [flag, setFlag] = useState(true);

  const getOrderRedeem = async () => {
    setShowLoader(true);
    try {
      const response = await apiCall(API_URLS.ORDER_REDEEM_LIST.getOrderRedeemList + selectedValue, HTTP_METHODS.GET);

      if (response.status === HTTP_RESPONSE.SUCCESS) {

        setRedeemList(response?.data);
        setShowLoader(false);
      }
    }
    catch (error) {
      setShowLoader(false);
    } finally {
      setShowLoader(false);
    }
  }

  useEffect(() => {
    getOrderRedeem();
  }, []);

  const handleSearch = async () => {
    setShowLoader(true);
    try {
      const response = await apiCall(`${API_URLS.ORDER_REDEEM_LIST.searchOrderRedeemList}${search}&store=${selectedValue}`, HTTP_METHODS.GET);
      if (response.status === HTTP_RESPONSE.SUCCESS) {
        setRedeemList(response.data);
        setShowLoader(false);
      }
    }
    catch (error) {
      setRedeemList([]);
      setShowLoader(false);
    }
  }

  useEffect(() => {
    if (flag) {
      setFlag(false);
      return;
    }

    const debounce = setTimeout(() => {
      if (!search.trim()) {
        getOrderRedeem()
      }
      else {
        handleSearch();
      }
    }, 1000)

    return () => clearTimeout(debounce);
  }, [search]);

  const filterApi = async (payload) => {
    const { endDate, startDate } = payload;
    return apiCall(`/points/getOrderRedeemFilter?start_date=${startDate}&end_date=${endDate}&store=rajnigandha`, HTTP_METHODS.GET, {});
  };

  const ZipApi = async (payload) => {
    const { endDate, startDate } = payload;
    return apiCall(`/points/getOrderRedeemFilter?start_date=${startDate}&end_date=${endDate}&store=rajnigandha`, HTTP_METHODS.GET, {});
  };

  const handleFilterApply = (data) => {
    if (data.length === 0) {
      setRedeemList([]);
      return;
    }
    setRedeemList(data?.data);
  };

  // -----------------------------------------------zipfile----------

  const generateZip = (data) => {
    return new Promise((resolve, reject) => {
      if (!data || data.length === 0) {
        console.error(msg.pdfNotGenerated);
        reject(new Error(msg.noDataFound));
        return;
      }

      const pdfData = data;
      const doc = new jsPDF();
      const img = new Image();
      const imagePath = "/redemptionImage.jpg"; // Ensure correct path

      img.src = imagePath;
      img.onload = () => {
        // Add Background Image
        doc.addImage(img, "JPEG", 0, 0, 210, 297);

        // Set margin values
        const marginTop = 30; // 30px margin
        const leftMargin = 15;
        const rightMargin = 195; // Align right

        // Add Title
        doc.setFontSize(16);
        doc.text(" ", 105, marginTop, { align: "center" });

        // Add Customer Details with Margin
        doc.setFontSize(10);

        const capitalizeFirstLetter = (str) => {
          return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
        };

        // Header details
        doc.text(`Account ID - ${pdfData?.account_number || ''}`, rightMargin, 65, { align: 'right' });

        doc.text(`To: Mr/Ms ${capitalizeFirstLetter(data?.name || '')}`, leftMargin, 68);
        doc.text(`Mobile : ${pdfData?.contact_no || ''}`, leftMargin, 74);
        doc.text(`Email Id : ${pdfData?.email || ''}`, leftMargin, 80);
        doc.text(`Pin Code : ${pdfData?.pincode || ''}`, leftMargin, 86);
        doc.text(`Address : ${pdfData?.billing_address || ''}`, leftMargin, 92);
        doc.text(`Order Id : ${pdfData?.order_id}`, leftMargin, 105);

        // const redeemDate = new Date();
        // const formattedDate = `${String(redeemDate.getDate()).padStart(2, '0')}/${String(redeemDate.getMonth() + 1).padStart(2, '0')}/${String(redeemDate.getFullYear())}`;
        // doc.text(`Order Date : ${formattedDate}`, rightMargin, 70, { align: 'right' });

        const redeemDate = new Date(pdfData?.createdAt); // Parse the API date
        const formattedDate = `${String(redeemDate.getDate()).padStart(2, '0')}/${String(redeemDate.getMonth() + 1).padStart(2, '0')}/${redeemDate.getFullYear()}`;
        doc.text(`Order Date : ${formattedDate}`, rightMargin, 70, { align: 'right' });


        // Table Headers
        const headers = ["Sr. No.", "Product", "Item Code", "Qty", "Points", "Total Points"];


        // const productData = pdfData?.product_name?.map((_, idx) => {
        //   const productKeys = Object.keys(pdfData.product_name[idx]); // Extract keys like p1, p2, p3...
        //   return productKeys.map((key) => [
        //     idx + 1, // Serial number
        //     pdfData.product_name[idx]?.[key] || "-", // Product name
        //     pdfData.product_sku?.[idx]?.[key] || "-", // SKU
        //     pdfData.product_quantity?.[idx]?.[key] || "-",
        //     parseInt(pdfData.product_actual_point[idx][key]) || '-',
        //     parseInt(pdfData?.product_redeem_point?.[idx]?.[key]) || '-',
        //   ]);
        // }).flat(); // Flatten the nested array


        const productData = pdfData?.product_name?.map((_, idx) => {
          const productKeys = Object.keys(pdfData.product_name?.[idx] || {}); // fallback to empty object
          return productKeys.map((key) => [
            idx + 1, // Serial number
            pdfData.product_name?.[idx]?.[key] || "-", // Product name
            pdfData.product_sku?.[idx]?.[key] || "-",  // SKU
            pdfData.product_quantity?.[idx]?.[key] || "-", // Quantity
            parseInt(pdfData.product_actual_point?.[idx]?.[key]) || '-', // Actual Point
            parseInt(pdfData.product_redeem_point?.[idx]?.[key]) || '-', // Redeem Point
          ]);
        }).flat(); // Flatten the nested array


        const productTableData = [
          ...productData,
          ["", "Total", "", "", "", parseInt(data?.redeem_points)]
        ];

        // Add Table to PDF with Margin
        autoTable(doc, {
          head: [headers],
          body: productTableData,
          startY: marginTop + 80, // Adjusted for 30px margin
          theme: "grid",
          styles: { fontSize: 10, halign: "center" },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 50 },
            2: { cellWidth: 40 },
            3: { cellWidth: 20 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 },
          },
          margin: { left: 15, right: 15 },
        });

        // Final Message with Margin
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text("Thank you for showing interest in our program. We seek your continued support in making our", leftMargin, finalY + 8);
        doc.text("products and all activities a success.", leftMargin, finalY + 13);
        doc.text("Regards", leftMargin, finalY + 23);
        doc.text("Rajnigandha Rewards Team", leftMargin, finalY + 28);

        // Convert to Blob and resolve promise
        const pdfBlob = doc.output("blob");
        resolve(pdfBlob);
      };

      img.onerror = (err) => {
        console.error("Error loading image:", err);
        reject(new Error("Failed to load the image for the PDF."));
      };
    });
  };

  const handleZipApply = (data) => {
    if (data.length === 0) {
      setRedeemList([]);
      return;
    }
    setRedeemList(data?.data);

    const orders = data?.data;
    const zip = new JSZip();

    const pdfPromises = orders.map((order) => {
      return generateZip(order).then((pdfBlob) => {
        zip.file(`${order.order_id}.pdf`, pdfBlob);
      });
    });
    // Order ID

    Promise.all(pdfPromises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `Bulk Order-pdf.zip`);
        showPopup("success", 'All Orders fetched successfully!')

      });
    });
  };
  const headers = {
    account_number: 'Account Number',
    name: 'Customer Name',
    contact_no: 'Mobile No.',
    email: 'Email',
    order_id: 'Order Id',
    order_name: 'Order Name',
    product_name: 'Product Name',
    product_sku: 'Product SKU',
    product_actual_point: "Product Redeem Point",
    product_quantity: 'Quantity',
    product_redeem_point: 'Total Redeem Points',
    billing_address: 'Billing Address',
    pincode: "Pincode",
    createdAt: 'Redeem Date',
    state: 'state',
    order_status: 'Status'
  }

  const columns = [
    "account_number",
    "name",
    "contact_no",
    "email",
    "order_id",
    "order_name",
    "product_name",
    "product_sku",
    "product_actual_point",
    "product_quantity",
    "product_redeem_point",
    "billing_address",
    "pincode",
    "redeem_date",
    "state",
    "order_status"
  ];

  const createPDF = (data) => {
    const doc = new jsPDF();
    const imagePath = '/redemptionImage.jpg';

    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const base64Image = canvas.toDataURL('image/jpeg');

      // Add the background image
      doc.addImage(base64Image, 'JPEG', 0, 0, 210, 297); // A4 size: 210mm x 297mm
      doc.setFontSize(10);

      const capitalizeFirstLetter = (str) => {
        return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
      };

      const leftMargin = 15;
      const rightMargin = 210 - 15;

      doc.text(`Account ID - ${data?.account_number || ''}`, rightMargin, 65, { align: 'right' });

      doc.text(`To: Mr/Ms ${capitalizeFirstLetter(data?.name || '')}`, leftMargin, 68);
      doc.text(`Mobile : ${data?.contact_no || ''}`, leftMargin, 74);
      doc.text(`Email Id : ${data?.email || ''}`, leftMargin, 80);
      doc.text(`Pin Code : ${data?.pincode || ''}`, leftMargin, 86);
      doc.text(`Order Id : ${data?.order_id}`, leftMargin, 92);

      // Handle address with proper line breaks and wrapping
      const maxWidth = 180; // 210mm page width - 15mm left margin - 15mm right margin
      let address = data?.billing_address || '';
      // Split the address into lines based on \n
      let addressLines = address.split('\n').filter(line => line.trim() !== '');
      let currentY = 98;

      // Render the first line with "Address:" prefix
      if (addressLines.length > 0) {
        const firstLine = `Address: ${addressLines[0]}`;
        const wrappedFirstLine = doc.splitTextToSize(firstLine, maxWidth);
        doc.text(wrappedFirstLine, leftMargin, currentY);
        currentY += wrappedFirstLine.length * 6; // 6mm per line
      }

      // Render subsequent lines without the "Address:" prefix
      for (let i = 1; i < addressLines.length; i++) {
        const wrappedLine = doc.splitTextToSize(addressLines[i], maxWidth);
        doc.text(wrappedLine, leftMargin, currentY);
        currentY += wrappedLine.length * 6; // 6mm per line
      }

      // If the address is a single long line (no \n), ensure it’s wrapped
      if (addressLines.length === 1 && addressLines[0].length > 0) {
        const wrappedAddress = doc.splitTextToSize(`Address: ${addressLines[0]}`, maxWidth);
        doc.text(wrappedAddress, leftMargin, 98);
        currentY = 98 + wrappedAddress.length * 6; // Update currentY based on wrapped lines
      }

      // const redeemDate = new Date();
      // const formattedDate = `${String(redeemDate.getDate()).padStart(2, '0')}/${String(redeemDate.getMonth() + 1).padStart(2, '0')}/${String(redeemDate.getFullYear())}`;
      // doc.text(`Order Date  : ${formattedDate}`, rightMargin, 70, { align: 'right' });


      const redeemDate = new Date(data?.createdAt); // Parse the API date
      const formattedDate = `${String(redeemDate.getDate()).padStart(2, '0')}/${String(redeemDate.getMonth() + 1).padStart(2, '0')}/${redeemDate.getFullYear()}`;
      doc.text(`Order Date : ${formattedDate}`, rightMargin, 70, { align: 'right' });

      const productData = Array.isArray(data?.product_name)
        ? data.product_name.map((product, idx) => {
          const productKey = Object.keys(product || {})[0];

          return [
            `${idx + 1}`,
            product?.[productKey] || "-",
            data?.product_sku?.[idx]?.[productKey] || "-",
            data?.product_quantity?.[idx]?.[productKey] || "-",
            parseInt(data?.product_actual_point?.[idx]?.[productKey]) || "-",
            parseInt(data?.product_redeem_point?.[idx]?.[productKey]) || "-",
          ];
        })
        : [];

      const productTableData = [
        ...productData,
        ["", "Total", "", "", "", parseInt(data?.redeem_points)]
      ];

      // Add table for product details
      autoTable(doc, {
        head: [['Sr. No.', 'Product', 'Item Code', 'Qty', 'Points', 'Total Points']],
        body: productTableData,
        theme: 'grid',
        styles: { fontSize: 8, halign: 'center' },
        startY: currentY + 10, // Start table 10mm below the last address line
        margin: { left: 15, right: 15 },
      });

      const finalY = doc.lastAutoTable.finalY || currentY + 10;
      doc.text('Thank you for showing interest in our program. We seek your continued support in making our', leftMargin, finalY + 15);
      doc.text('products and all activities a success.', leftMargin, finalY + 20);
      doc.text('Regards,', leftMargin, finalY + 30);
      doc.text('Rajnigandha Loyalty Team', leftMargin, finalY + 34);

      // Save the PDF
      doc.save('Redemption_List.pdf');
    };

    img.onerror = () => {
      console.error('Error loading image.');
      showPopup('error', 'Failed to load the image for the PDF.');
    };
  };

  const handleGeneratePDF = async (accountId, orderId) => {

    try {
      const response = await apiCall(`/dsProducts/generateDataInPDF?orderId=${orderId}&accountId=${accountId}`, "GET", {});


      if (response.status === 200) {
        const data = response.data[0];
        createPDF(data);  // Pass the data directly
      }
    } catch (error) {
      showPopup('error', error.message);
    }
  };

  const generatePDF = (data) => {
    return new Promise((resolve, reject) => {
      if (!data || data.length === 0) {
        console.error("No data available to generate PDF.");
        reject(new Error("No data available"));
        return;
      }

      const pdfData = data[0];
      const doc = new jsPDF();
      const img = new Image();
      const imagePath = "/redemptionImage.jpg";

      img.src = imagePath;
      img.onload = () => {
        // Add Background Image
        doc.addImage(img, "JPEG", 0, 0, 210, 297);

        // Set margin values
        const marginTop = 30; // 30px margin
        const leftMargin = 15;
        const rightMargin = 195; // Align right

        // Add Title
        doc.setFontSize(16);
        doc.text(" ", 105, marginTop, { align: "center" });

        const capitalizeFirstLetter = (str) => {
          return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
        };
        doc.setFontSize(10);

        doc.text(`Account ID - ${pdfData?.account_number || ''}`, rightMargin, 65, { align: 'right' });
        doc.text(`To: Mr/Ms ${capitalizeFirstLetter(pdfData?.name || '')}`, leftMargin, 68);
        doc.text(`Mobile : ${pdfData?.contact_no || ''}`, leftMargin, 74);
        doc.text(`Email Id : ${pdfData?.email || ''}`, leftMargin, 80);
        doc.text(`Pin Code : ${pdfData?.pincode || ''}`, leftMargin, 86);
        doc.text(`Order Id : ${pdfData?.order_id}`, leftMargin, 92);

        // Handle address with proper line breaks and wrapping
        const maxWidth = 180; // 210mm page width - 15mm left margin - 15mm right margin
        let address = pdfData?.billing_address || '';
        // Split the address into lines based on \n
        let addressLines = address.split('\n').filter(line => line.trim() !== '');
        let currentY = 98;

        // Render the first line with "Address:" prefix
        if (addressLines.length > 0) {
          const firstLine = `Address: ${addressLines[0]}`;
          const wrappedFirstLine = doc.splitTextToSize(firstLine, maxWidth);
          doc.text(wrappedFirstLine, leftMargin, currentY);
          currentY += wrappedFirstLine.length * 6; // 6mm per line
        }

        // Render subsequent lines without the "Address:" prefix
        for (let i = 1; i < addressLines.length; i++) {
          const wrappedLine = doc.splitTextToSize(addressLines[i], maxWidth);
          doc.text(wrappedLine, leftMargin, currentY);
          currentY += wrappedLine.length * 6; // 6mm per line
        }

        // If the address is a single long line (no \n), ensure it’s wrapped
        if (addressLines.length === 1 && addressLines[0].length > 0) {
          const wrappedAddress = doc.splitTextToSize(`Address: ${addressLines[0]}`, maxWidth);
          doc.text(wrappedAddress, leftMargin, 98);
          currentY = 98 + wrappedAddress.length * 6; // Update currentY based on wrapped lines
        }

        // const redeemDate = new Date();
        // const formattedDate = `${String(redeemDate.getDate()).padStart(2, '0')}/${String(redeemDate.getMonth() + 1).padStart(2, '0')}/${String(redeemDate.getFullYear())}`;

        // doc.text(`Order Date : ${formattedDate}`, rightMargin, 70, { align: 'right' });
        const redeemDate = new Date(pdfData?.createdAt); // Parse the API date
        const formattedDate = `${String(redeemDate.getDate()).padStart(2, '0')}/${String(redeemDate.getMonth() + 1).padStart(2, '0')}/${redeemDate.getFullYear()}`;
        doc.text(`Order Date : ${formattedDate}`, rightMargin, 70, { align: 'right' });

        // Table Headers
        const headers = ["Sr. No.", "Product", "Item Code", "Qty", "Points", "Total Points"];
        const productData = pdfData?.product_name?.map((_, idx) => {
          const productKeys = Object.keys(pdfData.product_name[idx]); // Extract keys like p1, p2, p3...
          return productKeys.map((key) => [
            idx + 1, // Serial number
            pdfData.product_name[idx]?.[key] || "-",
            pdfData.product_sku?.[idx]?.[key] || "-",
            pdfData.product_quantity?.[idx]?.[key] || "-",
            parseInt(pdfData.product_actual_point?.[idx]?.[key]) || "-",
            parseInt(pdfData.product_redeem_point?.[idx]?.[key]) || "-",
          ]);
        }).flat(); // Flatten the nested array

        const productTableData = [
          ...productData,
          ["", "Total", "", "", "", parseInt(pdfData?.redeem_points)]
        ];

        // Add Table to PDF with Margin
        autoTable(doc, {
          head: [headers],
          body: productTableData,
          startY: currentY + 10, // Start table 10mm below the last address line
          theme: "grid",
          styles: { fontSize: 10, halign: "center" },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 50 },
            2: { cellWidth: 40 },
            3: { cellWidth: 20 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 },
          },
          margin: { left: 15, right: 15 },
        });

        // Final Message with Margin
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text("Thank you for showing interest in our program. We seek your continued support in making our", leftMargin, finalY + 8);
        doc.text("products and all activities a success.", leftMargin, finalY + 13);
        doc.text("Regards", leftMargin, finalY + 23);
        doc.text("Rajnigandha Rewards Team", leftMargin, finalY + 28);

        // Convert to Blob and resolve promise
        const pdfBlob = doc.output("blob");
        resolve(pdfBlob);
      };

      img.onerror = (err) => {
        console.error("Error loading image:", err);
        reject(new Error("Failed to load the image for the PDF."));
      };
    });
  };

  const handleSend = async (accountId, orderId) => {
    try {

      // 1. Fetch data from the first API
      const response = await apiCall(`/dsProducts/generateDataInPDF?orderId=${orderId}&accountId=${accountId}`, HTTP_METHODS.GET, {});

      const formData = new FormData();
      formData.append("pdfFile", await generatePDF(response.data), "order_pdf.pdf");
      formData.append("orderId", orderId);
      formData.append("accountId", accountId);

      const headers = {
        "Content-Type": "multipart/form-data"
      }
      const response2 = await apiCall("/dsProducts/sendProductOrderPDF", HTTP_METHODS.POST, formData, headers);

      if (response2.status === HTTP_RESPONSE.SUCCESS) {
        showPopup("success", response2.message)
      }
    } catch (error) {
      console.error("Error:", error);
      showPopup("error", error.message); // Show a popup with the error
    }
  };

  const handleTrack = (orderNo) => {
    let env_url = process.env.REACT_APP_WEBSITE_URL;
    const url = orderNo !== null ? `${env_url}/pages/track-order?tracking_number=${orderNo}` : env_url;
    window.open(url, '_blank');
  }

  const data = {};

  const disableUpdate = () => {
    showPopup('warning', msg.readOnly);
  }

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-medium">Order Redeem List</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search by Account Number, Order Id"
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-3/4 lg:w-[400px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Dropdown for Export */}
          <div className="flex gap-3">
            <Filter
              isVisible={showFilterPopup}
              onClose={() => setShowFilterPopup(false)}
              filterApi={filterApi}
              onFilterApply={handleFilterApply}
              filterConfig={[
                { field: "startDate", label: "Start Date", type: "date" },
                { field: "endDate", label: "End Date", type: "date" },
              ]}
              // clear={getOrderRedeem}
              formState={formState}
              setFormState={setFormState}
            />

            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => setShowFilterPopup(true)}
            >
              Filter
            </button>
            {search ? <>
              <ExportDropdowns data={currentreedeemList.map((item, index) => ({
                ...item,
                srno: index + 1,
              }))}
                filename="Product_Redeem_List" columns={columns} headers={headers} />
            </> : <>
              <ExportDropdown
                url='/points/orderRedeemMigrationExport'
                filterStartDate={formState?.startDate}
                filterStartEnd={formState?.endDate}
                columns={columns}
                headers={headers}
                setShowLoader={setShowLoader}
              />
            </>}

            <Filter
              isVisible={showZipPopup}
              onClose={() => setShowZipPopup(false)}
              filterApi={ZipApi}
              onFilterApply={handleZipApply}

              filterConfig={[
                { field: "startDate", label: "Start Date", type: "date" },
                { field: "endDate", label: "End Date", type: "date" },
              ]}
              // clear={getOrderRedeem}
              formState={formState}
              setFormState={setFormState}
            />

            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => setShowZipPopup(true)}
            >
              ZipFile
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="text-left bg-gray-100 border-b h-12">
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">S.No.</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Account Number</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Customer Name</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Mobile No.</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Email</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Order Id</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Order Name</th>
              {/* <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Order Number</th> */}
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Product Name</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Product SKU</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Product Redeem Point</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Quantity</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Total Redeem Points</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Billing Address</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Pin Code</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Redeem Date</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">State</th>
              <th className="px-2 py-2 border-r font-medium  whitespace-nowrap">Status</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Generate PDF</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Send PDF</th>
              <th className="px-2 py-2 border-r font-medium whitespace-nowrap">Track URL</th>
            </tr>
          </thead>
          <tbody>
            {currentreedeemList.map((product, idx) =>
              Object.keys(product?.product_name).map((key, index) => (
                <tr key={`${product.id}-${index}`} className="text-gray-700">
                  {index === 0 && (
                    <>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {idx + 1}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.account_number}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap capitalize"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.name}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.contact_no}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.email}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.order_id}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.order_name}
                      </td>
                      {/* <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.product_name?.[key]?.[`p${index + 1}`]}
                      </td> */}
                    </>
                  )}

                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {product?.product_name?.[key]?.[`p${index + 1}`]}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {product?.product_sku?.[key]?.[`p${index + 1}`]}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {Number(product?.product_actual_point?.[key]?.[`p${index + 1}`]).toFixed(0)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                    {product?.product_quantity?.[key]?.[`p${index + 1}`]}
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                  // rowSpan={Object.keys(product?.product_name).length}
                  >
                    {product?.product_redeem_point?.[key]?.[`p${index + 1}`]}
                  </td>
                  {index === 0 && (
                    <>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.billing_address}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product.pincode}
                      </td>
                      {/* <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {new Date(product?.createdAt).toLocaleDateString('en-GB')}
                      </td> */}
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {`${String(new Date(product?.createdAt).getUTCDate()).padStart(2, '0')}/${String(new Date(product?.createdAt).getUTCMonth() + 1).padStart(2, '0')}/${new Date(product?.createdAt).getUTCFullYear()}`}
                      </td>

                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.state}
                      </td>
                      <td
                        className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                        rowSpan={Object.keys(product?.product_name).length}
                      >
                        {product?.order_status}
                      </td>

                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                          rowSpan={Object.keys(product?.product_name).length}>
                          <button className='p-2 bg-green-600 text-white rounded'
                            onClick={() => handleGeneratePDF(product?.account_number, product?.order_id)}
                          >PDF</button>
                        </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                          rowSpan={Object.keys(product?.product_name).length}>
                          <button className='p-2 bg-green-600 text-white rounded'
                            onClick={() => handleSend(product?.account_number, product?.order_id)}
                          >Send</button>
                        </td>
                      <td className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                          rowSpan={Object.keys(product?.product_name).length}>
                          <button className='p-2 bg-green-600 text-white rounded'
                            onClick={() => handleTrack(product?.order_number)}
                          >Track</button>
                        </td>

                    </>
                  )}
                </tr>
              ))
            )}


          </tbody>
        </table>

        {isPopupOpen && selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">View Details</h3>
                <button onClick={handleClosePopup} className="text-gray-500 hover:text-gray-700">
                  <CloseIcon />
                </button>
              </div>
              <div className="mt-4">
                <p><strong>City:</strong> {selectedOrder.city}</p>
                <p><strong>State:</strong> {selectedOrder.state}</p>
                <p><strong>Pin Code:</strong> {selectedOrder.pinCode}</p>
                <p><strong>Address Line 1:</strong> {selectedOrder.addressLine1}</p>
                <p><strong>Address Line 2:</strong> {selectedOrder.addressLine2}</p>
              </div>
            </div>
          </div>
        )}
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
  );

};

export default ProductRedeemList;

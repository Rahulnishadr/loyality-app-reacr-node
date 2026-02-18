import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiCall } from "../api/Api";
import ExportDropdown from "../reusable/Export_to_excel";
import Filter from "../reusable/Filter";
import LoaderSpiner from '../reusable/LoaderSpiner';
import { showPopup } from "../reusable/Toast";

const CategoryList = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    status: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentList = categories.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchCategories = async () => {
    setShowLoader(true)
    try {
      const url = `/dsProducts/fetchDBCategories`;

      // Make the API call
      const response = await apiCall(url, "GET");
      if (Array.isArray(response.data) && response.data.length === 0) {
        setShowLoader(false)
        setCategories([])
        return;
      }

      if (response.status === 200) {
        setShowLoader(false)
        const transformedData = response.data.map((category) => ({
          id: category?.id,
          name: category?.name,
          createDate:
            new Date(category?.createDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }) || "N/A",
          updateDate:
            new Date(category?.updateDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }) || "N/A",
          updateBy: category?.updatedByStaff,
          status: category?.status,
        }));

        setCategories(transformedData);
      }
    } catch (error) {
      setShowLoader(false);
      
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const data = {
        categoryId: id,
        status: status === "active" ? "inactive" : "active",
      };

      const response = await apiCall("/dsProducts/updateCategory", "PUT", data);

      if (response.status === 200) {
        fetchCategories();
      }
    } catch (error) {
      showPopup("error", error.message);
    }
  };

  const handleAddCategory = async () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setCurrentCategory('');
  };

  const [updateId, setUpdateId] = useState(null);

  const handleEditCategory = (id) => {
    setUpdateId(id);
    const category = categories.find((item) => item.id === id)
    setCurrentCategory(category);

    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (updateId) {
        const data = {
          categoryId : updateId,
          name: currentCategory.name, 
          status: currentCategory.status
        }
        const response = await apiCall('/dsProducts/updateCategory', 'PUT', data);

        if (response.status === 200) {
          showPopup('success', response.message);
          fetchCategories();
          setCurrentCategory({
            name: "",
            status: false,
          });
        }

      } else {
        const data = {
          categoryName: currentCategory.name,
          categoryStatus: currentCategory.status
        }
        const response = await apiCall('/dsProducts/addCategory', 'POST', data);

        if (response.status === 201) {
          showPopup('success', response.message);
          fetchCategories();
          setCurrentCategory({
            name: "",
            status: false,
          });
        }
      }
    }
    catch (error) {
      showPopup("error", error.message);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const data = {};

      const response = await apiCall(
        `/dsProducts/deleteCategory/?categoryId=${id}`,
        "DELETE",
        data
      );

      if (response.status === 200) {
        fetchCategories();
      }
    } catch (error) {
      showPopup("error", error.message);
    }
  };

  const columns = [
    "id",
    "name",
    "createDate",
    "updateDate",
    "updateBy",
    "status",
  ];

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [search, setSearch] = useState('');
  // const [filteredData, setFilteredData] = useState([]);

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      <Filter
        isVisible={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        // fetchBrandOptionsApi={fetchBrandOptionsApi}
        // filterApi={filterApi}
        // onFilterApply={handleFilterApply}
        filterFields={{ page: 1, limit: 15 }}
      />
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-medium">Category List</h2>
        {/* <DateFilter onSubmit={handleFilterSubmit} /> */}
        <div className="flex space-x-4">

          <input
            type="text"
            placeholder="Search By Brand Name"
            className="p-2 border border-gray-300 rounded me-2 w-3/3 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setShowFilterPopup(true)}
          >
            Filter
          </button>
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
          <ExportDropdown
            data={categories}
            filename="Category_List"
            columns={columns}
          />
        </div>
      </div>

      <table className="min-w-full">
        <thead>
          <tr className='text-left bg-gray-100 h-12'>
            <th className="px-2 py-2 border font-medium">S.No.</th>
            <th className="px-2 py-2 border font-medium">Category Name</th>
            <th className="px-2 py-2 border font-medium">Create Date</th>
            <th className="px-2 py-2 border font-medium">Update Date</th>
            <th className="px-2 py-2 border font-medium">Update By Staff</th>
            <th className="px-2 py-2 border font-medium">Status</th>
            <th className="px-2 py-2 border font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            currentList.length > 0 ? (
              currentList.map((category, index) => (
                <tr key={category.id} className="text-left font-medium text-sm border-b hover:bg-gray-50">
                  <td className="px-2 py-2 border">{indexOfFirst + index + 1}</td>
                  <td className="px-2 py-2 border">{category.name}</td>
                  <td className="px-2 py-2 border">{category.createDate}</td>
                  <td className="px-2 py-2 border">{category.updateDate}</td>
                  <td className="px-2 py-2 border">{category.updateBy}</td>
                  <td className="px-2 py-2 border">
                    <Switch
                      checked={category?.status === "active"}
                      onChange={() => {
                        handleStatus(category?.id, category?.status);
                      }}
                    />
                  </td>
                  <td className="px-2 py-2 border">
                    <EditIcon
                      className="text-sky-500 cursor-pointer"
                      onClick={() => handleEditCategory(category?.id)}
                    />
                    <DeleteIcon
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteCategory(category?.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="p-4 text-center text-red-500">
                  No data found
                </td>
              </tr>
            )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Category" : "Add Category"}
            </h2>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Category Name"
                value={currentCategory.name}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    name: e.target.value,
                  })
                }
                className="border p-2 w-full h-full rounded-md mb-2"
              />

              <select
                value={currentCategory.status}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    status: e.target.value,
                  })
                }
                className="border p-2 w-full h-full rounded-md mb-2"
              >
                <option>Show Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Save and Cancel Buttons */}
            <button
              onClick={handleSaveCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              {isEditMode ? "Update" : "Add"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-end items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1
            ? "bg-gray-300 cursor-not-allowed me-2"
            : "bg-blue-600 text-white me-2"
            }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed ms-2"
            : "bg-blue-600 text-white ms-2"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryList;

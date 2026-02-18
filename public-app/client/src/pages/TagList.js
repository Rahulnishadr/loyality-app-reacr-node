import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiCall } from "../api/Api";
import ExportDropdown from "../reusable/Export_to_excel";
import DateFilter from "../reusable/Filter";
import LoaderSpiner from '../reusable/LoaderSpiner';
import { showPopup } from "../reusable/Toast";

const TagList = () => {
  const [showLoader, setShowLoader] = useState(false); 
  const [tagData, setTagData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    status: '',
  });

  const handleAddTag = () => {
    setCurrentCategory({
      name: "",
      status: false,
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const [updateId, setUpdateId] = useState();

  const handleEditTag = (id) => {
    setUpdateId(id);
    const tag = tagData.find((item) => item.id === id)
    setCurrentCategory(tag);

    setIsEditMode(true);
    setIsModalOpen(true);
  };


  const handleSaveTag = async () => {
    try {
      if (updateId) {
        const data = {
          tagId : updateId,
          name: currentCategory.name, 
          status: currentCategory.status
        }
        const response = await apiCall('/dsProducts/updateTag', 'PUT', data);

        if (response.status === 200) {
          showPopup('success', response.message);
          getTagData();
          setCurrentCategory({
            name: "",
            status: false,
          });
        }

      } else {
        const data = {
          tagName: currentCategory.name,
          tagStatus: currentCategory.status
        }

        const response = await apiCall('/dsProducts/addTag', 'POST', data);

        if (response.status === 201) {
          showPopup('success', response.message);
          getTagData();
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

  const getTagData = async () => {
    setShowLoader(true)
    try {
       const url = `/dsProducts/fetchDBTags`;
  
       const response = await apiCall(url, "GET");
      if (Array.isArray(response.data) && response.data.length === 0) {
        setShowLoader(false)
        setTagData([])
        return;
    }
  
      if (response.status === 200) {
        setShowLoader(false)
        const transformedData = response.data.map((tag) => ({
          id: tag?.id,
          name: tag?.name,
          createDate:
            new Date(tag?.createDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }) || "N/A",
          updateDate:
            new Date(tag?.updateDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }) || "N/A",
          updateByStaff: tag?.updatedByStaff,
          status: tag?.status,
        }));
  
        setTagData(transformedData);
      }
    } catch (error) {
      setShowLoader(false)
      
    }
  };
  
  useEffect(() => { 
    getTagData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 15;

  const indexOfLastTag = currentPage * tagsPerPage;
  const indexOfFirstTag = indexOfLastTag - tagsPerPage;
  const currentTags = tagData.slice(indexOfFirstTag, indexOfLastTag);

  const totalPages = Math.ceil(tagData.length / tagsPerPage);

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleStatus = async (id, status) => {
    try {
      const data = {
        tagId: id,
        status: status === "active" ? "inactive" : "active",
      };

      const response = await apiCall("/dsProducts/updateTag", "PUT", data);

      if (response.status === 200) {
        getTagData();
      }
    } catch (error) {
      showPopup("error", error.message);
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      const data = {};
      const response = await apiCall(
        `/dsProducts/deleteTag?tagId=${id}`,
        "DELETE",
        data
      );

      if (response.status === 200) {
        getTagData();
      }
    } catch (error) {
      showPopup("error", error.message);
    }
  };

  const columns = [
    "name",
    "createDate",
    "updateDate",
    "updateByStaff",
    "status",
  ];

  const handleFilterSubmit = ({ startDate, endDate }) => {
    getTagData(startDate, endDate);
  };

  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tag List</h1>
        <DateFilter onSubmit={handleFilterSubmit} />
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddTag}
          >
            Add
          </button>
          <ExportDropdown
            data={tagData}
            filename="Tag_List"
            columns={columns}
          />
        </div>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left h-12">
            <th className="border px-4 py-2 font-medium whitespace-nowrap">S.No.</th>
            <th className="border px-4 py-2 font-medium whitespace-nowrap">Tag Name</th>
            <th className="border px-4 py-2 font-medium whitespace-nowrap">Tag Sequence</th>
            <th className="border px-4 py-2 font-medium whitespace-nowrap">Create Date</th>
            <th className="border px-4 py-2 font-medium whitespace-nowrap">Update Date</th>
            <th className="border px-4 py-2 font-medium whitespace-nowrap">Update ByStaff</th>
            <th className="border px-4 py-2 font-medium whitespace-nowrap">Status</th>
            <th className="border px-4 py-2 font-medium whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
        {currentTags.length==0? <tr>
                                    <td colSpan="12" className="p-4 text-center text-red-500">
                                        No data found
                                    </td>
                                </tr>:<></>}
          {currentTags.map((tag, index) => (
            <tr key={tag.id} className="text-left font-medium text-sm border-b hover:bg-gray-50">
              <td className="border px-4 py-2">{indexOfFirstTag + index + 1}</td>
              <td className="border px-4 py-2">{tag.name}</td>
              <td className="border px-4 py-2">
                N/A
              </td>
              <td className="border px-4 py-2">{tag.createDate}</td>
              <td className="border px-4 py-2">{tag.updateDate}</td>
              <td className="border px-4 py-2">{tag.updateByStaff}</td>
              <td className="border px-4 py-2">
                <Switch
                  checked={tag?.status === "active"}
                  onChange={() => {
                    handleStatus(tag?.id, tag?.status);
                  }}
                />
              </td>
              <td className="border px-4 py-2">
                <EditIcon className='text-sky-500 cursor-pointer' onClick={() => handleEditTag(tag?.id)} />

                <DeleteIcon
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteTag(tag?.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Tags" : "Add Tags"}
            </h2>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Tag Name"
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
              onClick={handleSaveTag}
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
          className={`px-4 py-2 rounded ${
            currentPage === 1
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
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
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

export default TagList;

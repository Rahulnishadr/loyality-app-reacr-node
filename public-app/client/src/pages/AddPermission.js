import React, { useEffect, useState } from 'react';
import TextField from '../reusable/InputText';
import Buttons from '../reusable/Buttons';
import Button from '@mui/material/Button';
import { apiCall } from '../api/Api';
import LoaderSpiner from '../reusable/LoaderSpiner';
import Toast, { showToast } from '../reusable/Toast';
import CustomModal from '../reusable/CustomModal';
import DataTable from '../reusable/DataTable';
 import axios from 'axios';
import '../App.css';

function AddPermission() {
     const apiURL = process.env.REACT_APP_BASE_URL;

     const [moduleData, setModuleData] = useState(''); // Stores module name
    const [showLoader, setShowLoader] = useState(false); // Loader visibility
    const [allModules, setAllModules] = useState([]); // List of all modules
    const [open, setOpen] = useState(false); // Modal open state
    const [isEditing, setIsEditing] = useState(false); // Track if editing mode is on
    const [selectedModuleId, setSelectedModuleId] = useState(null); // ID of selected module for editing
 
    // Open modal for adding or editing a module
    const handleOpen = () => setOpen(true);

    // Close modal and reset form data
    const handleClose = () => {
        setOpen(false);
        setModuleData(''); // Reset form data on close
        setIsEditing(false); // Reset to adding mode
    };

    // Handle module name input change
    const handleChange = (e) => setModuleData(e.target.value);

    // Add or update module data
    const handleButtonClick = async () => {
        setShowLoader(true);

        const data = {
            id: selectedModuleId,
            name: moduleData,
        };

        try {
            const apiPath = isEditing ? '/permission/update' : '/permission/create'; // Determine API path
            const apiMethod = isEditing ? 'PUT' : 'POST'; // Determine HTTP method
            const response = await apiCall(apiPath, apiMethod, data);

            if ((isEditing && response.status === 200) || (!isEditing && response.status === 201)) {
                setShowLoader(false)
                showToast(isEditing ? 'permission updated successfully!' : 'permission added successfully!', 'success');
                setOpen(false);
                getAllModule(); // Refresh the module list
            }
        } catch (error) {
            setShowLoader(false)
            showToast(error?.response?.data?.message?.errors || error?.message, 'error');
            
        } finally {
            setShowLoader(false);
        }
    };

    // Fetch the list of all modules
    const getAllModule = async () => {
        setShowLoader(true);
        try {
            const response = await apiCall('/permission/list', 'get');
            if (response.status === 200) {
                setShowLoader(false)
                setAllModules(response?.data);
            }
        } catch (error) {
            setShowLoader(false)
            console.error('Error fetching modules:', error?.response?.data?.message?.errors || error?.message);
        } finally {
            setShowLoader(false);
        }
    };

    useEffect(() => {
        getAllModule();
    }, []);

    

    // Handle editing a module
    const handleEdit = (module) => {
        setSelectedModuleId(module.id);
        setModuleData(module.name); // Set form field with the module name
        setIsEditing(true); // Enable editing mode
        setOpen(true); // Open modal
    };

    // Handle module deletion
    const handleDelete = async (id) => {
        try {
            const response = await axios({
                method: 'delete',
                url: `${apiURL}/permission/delete`,
                params: { id },
            });

            if (response.status === 200) {
                showToast('permission deleted successfully!', 'warning');
                getAllModule(); // Refresh the module list
            }
        } catch (error) {
            showToast(error?.response?.data?.message?.errors || error.message, 'error');
            console.error('Error deleting module:', error?.response?.data?.message?.errors || error.message);
        }
    };

    // Table columns definition
    const columns = [
        { field: 'name', headerName: 'Name', width: 350 },
        {
            field: 'createdAt',
            headerName: 'Created By',
            width: 350,
            
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 340,
            renderCell: (params) => (
                <>
                    <span className="span_icone cursor-pointer" onClick={() => handleEdit(params.row)}>
                        <i className="fa-regular fa-pen-to-square"></i>
                    </span>
                    <span className="span_icone cursor-pointer" onClick={() => handleDelete(params.row.id)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </span>
                </>
            ),
        },
    ];

    // Pagination settings
    const paginationModel = { page: 0, pageSize: 5 };

    // Form content for modal (used for adding/editing a module)
    const formContent = (
        <div className="flex justify-center items-center">
            <div className="">
                <h1 className="text-center mb-4">{isEditing ? 'Edit Permission' : 'Create New Permission'}</h1>
                <div className="mb-4">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Permission Name"
                        variant="outlined"
                        type="text"
                        required
                        value={moduleData}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex justify-center items-center mt-5">
                    <Buttons
                        fullWidth
                        type="button"
                        color="success"
                        label={isEditing ? 'Update Permission' : 'Save'}
                        variant="contained"
                        onClick={handleButtonClick}
                    />
                </div>
            </div>
        </div>
    );

    // Main component render
    return (
        <div>
            {showLoader && <LoaderSpiner text="Loading ..." />}
            <div className="container mx-auto px-4">
                <div className="flex justify-between m-2 items-baseline">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Permission</h2>
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        Add Permission
                    </Button>
                </div>
                <DataTable rows={allModules} columns={columns} paginationModel={paginationModel} />
            </div>
            <Toast />
            <CustomModal 
                open={open}
                handleClose={handleClose}
                description={formContent}
            />
        </div>
    );
}
 
export default AddPermission

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: '90vh',
    overflowY: 'auto',  // Enables scrolling if content overflows
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 1,
    // Hide the scrollbar but keep the scroll functionality
    '&::-webkit-scrollbar': {
        display: 'none',  // Hide scrollbar for WebKit browsers
    },
    '-ms-overflow-style': 'none',  // Hide scrollbar for IE and Edge
    'scrollbar-width': 'none',     // Hide scrollbar for Firefox
};



function CustomModal({ title, description, open, handleClose, children }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {description}
                </Typography>
                {children && <div>{children}</div>}
            </Box>
        </Modal>
    );
}

export default CustomModal;

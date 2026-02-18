import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    );
};

// Function to trigger different types of toast
export const showToast = (message, type = 'default') => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'info':
            toast.info(message);
            break;
        case 'warning':
            toast.warn(message);
            break;
        default:
            toast(message);
            break;
    }
};

export default Toast;

// newT Toast

import Swal from "sweetalert2";

const Popup = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const showPopup = (type, message) => {
    
  switch (type) {
    case "success":
      Popup.fire({ icon: "success", title: message });
      break;
    case "error":
      Popup.fire({ icon: "error", title: message });
      break;
    case "info":
      Popup.fire({ icon: "info", title: message });
      break;
    case "warning":
      Popup.fire({ icon: "warning", title: message });
      break;
    default:
      Popup.fire({ icon: "question", title: message });
      break;
  }
};
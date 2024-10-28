import { toast } from 'react-toastify';

const ToastHelper = {
  // Success toast
  showSuccess: (message) => {
    toast.success(message);
  },

  // Error toast
  showError: (error) => {
    toast.error(error);
  },
};

export default ToastHelper;

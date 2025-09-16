import React, { useEffect } from 'react';
import './SuccessToast.css';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessToast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast-container">
      <FaCheckCircle className="toast-icon" />
      <p>{message}</p>
    </div>
  );
};

export default SuccessToast;
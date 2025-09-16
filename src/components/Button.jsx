import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      className={`btn ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
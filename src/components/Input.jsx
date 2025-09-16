import React from 'react';
import './Input.css';

const Input = ({ label, id, type = 'text', value, onChange, placeholder }) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  );
};

export default Input;
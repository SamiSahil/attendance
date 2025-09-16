import React from 'react';
import Button from './Button';
import './Modal.css';

const DeleteModal = ({ isOpen, onClose, onConfirm, studentName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Delete Student?</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to permanently delete {studentName}? 
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
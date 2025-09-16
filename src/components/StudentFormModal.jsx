import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import './Modal.css';

// The initial blank state for the form
const INITIAL_STATE = {
  name: '', email: '', class: '', section: '', phone: '', guardian: ''
};

const StudentFormModal = ({ isOpen, onClose, onSave, student }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);

  // CRITICAL: This effect runs when the modal opens or the student prop changes.
  useEffect(() => {
    if (isOpen) {
      if (student) {
        // If there's a student prop, we are in "edit" mode.
        // Set the form data to this student's details.
        setFormData({
          name: student.name || '',
          email: student.email || '',
          class: student.class || '',
          section: student.section || '',
          phone: student.phone || '',
          guardian: student.guardian || '',
        });
      } else {
        // If there's no student prop, we are in "add" mode.
        // Reset the form to its initial blank state.
        setFormData(INITIAL_STATE);
      }
    }
  }, [student, isOpen]); // The effect depends on `student` and `isOpen`

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // The title of the modal is now dynamic
  const modalTitle = student ? 'Edit Student' : 'Add New Student';

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{modalTitle}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body form-grid">
            <Input label="Name" id="name" value={formData.name} onChange={handleChange} />
            <Input label="Email" id="email" type="email" value={formData.email} onChange={handleChange} />
            <div className="form-row">
              <Input label="Class" id="class" value={formData.class} onChange={handleChange} />
              <Input label="Section" id="section" value={formData.section} onChange={handleChange} />
            </div>
            <Input label="Phone" id="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Guardian Name" id="guardian" value={formData.guardian} onChange={handleChange} />
            <div className="input-group">
                <label>Profile Photo</label>
                <div className="file-input-wrapper">
                    <img src="/src/assets/avatar-placeholder.png" alt="avatar" className="avatar-preview" />
                    <input type="file" id="profilePhoto" className="file-input" />
                    <label htmlFor="profilePhoto" className="file-label">Choose File</label>
                    <span>No file chosen</span>
                </div>
            </div>
          </div>
          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
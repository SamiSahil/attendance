import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaSync, FaEdit, FaUserCircle } from 'react-icons/fa';
import { useData } from '../contexts/DataContext';
import { addStudent, updateStudent, deleteStudent, deleteMultipleStudents } from '../services/googleSheetService';
import Button from '../components/Button';
import StudentFormModal from '../components/StudentFormModal';
import DeleteModal from '../components/DeleteModal';
import SuccessToast from '../components/SuccessToast';
import './StudentList.css';

const StudentList = () => {
  // --- Central State from Context ---
  const { students, loading: contextLoading, error, refreshData } = useData();
  
  // --- UI State for this page ---
  const [pageLoading, setPageLoading] = useState(false); // For showing 'Updating...' overlay during write operations
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [toastInfo, setToastInfo] = useState({ isVisible: false, message: '' });

  const showToast = (message) => setToastInfo({ isVisible: true, message });

  // --- Initial Data Load ---
  useEffect(() => {
    // We only need to trigger the refresh from the context
    refreshData();
  }, [refreshData]);

  // --- Handlers for Data Manipulation ---
  const handleSaveStudent = async (formData) => {
    setFormModalOpen(false);
    setPageLoading(true);
    try {
      let result;
      if (studentToEdit) {
        // --- PERMANENT EDIT ---
        const dataToUpdate = { ...studentToEdit, ...formData };
        result = await updateStudent(dataToUpdate);
      } else {
        // --- PERMANENT ADD ---
        const dataToAdd = { Name: formData.name, Class: formData.class, Section: formData.section, Email: formData.email, Phone: formData.phone, 'Guardian Name': formData.guardian };
        result = await addStudent(dataToAdd);
      }
      showToast(result.message);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      await refreshData(); // Reload all data from the sheet to reflect changes
      setPageLoading(false);
      setStudentToEdit(null);
    }
  };

  const confirmDelete = async () => {
    setDeleteModalOpen(false);
    setPageLoading(true);
    try {
      // --- PERMANENT DELETE ---
      const result = await deleteStudent(studentToDelete.rowIndex);
      showToast(result.message);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      await refreshData();
      setPageLoading(false);
      setStudentToDelete(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedStudents.length === 0) {
      showToast('Please select students to delete.');
      return;
    }
    setPageLoading(true);
    try {
      // --- PERMANENT MULTI-DELETE ---
      const rowsToDelete = students
        .filter(s => selectedStudents.includes(s.id))
        .map(s => s.rowIndex);
      const result = await deleteMultipleStudents(rowsToDelete);
      showToast(result.message);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      await refreshData();
      setSelectedStudents([]);
      setPageLoading(false);
    }
  };

  // --- Handlers for UI ---
  const handleAddNewClick = () => { setStudentToEdit(null); setFormModalOpen(true); };
  const handleEditClick = (student) => { setStudentToEdit(student); setFormModalOpen(true); };
  const handleDeleteClick = (student) => { setStudentToDelete(student); setDeleteModalOpen(true); };
  const handleSelectAll = (e) => setSelectedStudents(e.target.checked ? students.map(s => s.id) : []);
  const handleSelectStudent = (id) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);

  // --- Render Logic ---
  if (contextLoading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading student data from Google...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="student-list-container">
      {pageLoading && <div className="loading-overlay"><span>Updating Sheet...</span></div>}
      <SuccessToast isVisible={toastInfo.isVisible} message={toastInfo.message} onClose={() => setToastInfo({ isVisible: false, message: '' })} />
      <StudentFormModal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} onSave={handleSaveStudent} student={studentToEdit} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} studentName={studentToDelete?.name} />

      <div className="toolbar">
        <Button variant="primary" onClick={handleAddNewClick}>
          <FaPlus /> Add New Student
        </Button>
        <div className="toolbar-right">
          <Button variant="secondary" onClick={() => refreshData(true).then(() => showToast('List refreshed!'))}>
            <FaSync /> Refresh List
          </Button>
          <Button variant="danger" onClick={handleDeleteSelected}>
            <FaTrash /> Delete Selected
          </Button>
        </div>
      </div>
      
      <div className="select-all-bar">
          <input type="checkbox" id="selectAll" onChange={handleSelectAll} checked={students.length > 0 && selectedStudents.length === students.length} />
          <label htmlFor="selectAll">Select All</label>
      </div>

      <div className="student-grid">
        {students.map(student => (
          <div key={student.id} className="student-card">
            <input type="checkbox" className="student-checkbox" checked={selectedStudents.includes(student.id)} onChange={() => handleSelectStudent(student.id)} />
            <FaUserCircle className="student-avatar" />
            <h3 className="student-name">{student.name}</h3>
            <p className="student-id">{student.id}</p>
            <div className="student-details">
              <p><strong>Class:</strong> {student.class}</p>
              <p><strong>Section:</strong> {student.section}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
              <p><strong>Guardian:</strong> {student.guardian}</p>
            </div>
            <div className="card-actions">
              <Button variant="secondary" onClick={() => handleEditClick(student)}>
                <FaEdit /> Edit
              </Button>
              <Button variant="danger" onClick={() => handleDeleteClick(student)}>
                <FaTrash /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
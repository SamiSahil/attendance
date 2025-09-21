import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSync, FaEdit } from 'react-icons/fa';
import { useData } from '../contexts/DataContext';
import { addStudent, updateStudent, deleteStudent, deleteMultipleStudents } from '../services/googleSheetService';
import Button from '../components/Button';
import StudentFormModal from '../components/StudentFormModal';
import DeleteModal from '../components/DeleteModal';
import SuccessToast from '../components/SuccessToast';
import SkeletonCard from '../components/SkeletonCard';
import './StudentList.css';
import newAvatar from '../assets/young.png';

const StudentList = () => {
  const { students, loading: contextLoading, error, refreshData } = useData();
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [toastInfo, setToastInfo] = useState({ isVisible: false, message: '' });

  const showToast = (message) => setToastInfo({ isVisible: true, message });

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSaveStudent = async (formData) => {
    setFormModalOpen(false);
    setPageLoading(true);
    try {
      let result;
      if (studentToEdit) {
        const dataToUpdate = { ...studentToEdit, ...formData, 'Tuition Fee': formData.tuitionFee };
        result = await updateStudent(dataToUpdate);
      } else {
        const dataToAdd = { Name: formData.name, Class: formData.class, Section: formData.section, Email: formData.email, Phone: formData.phone, 'Guardian Name': formData.guardian, 'Tuition Fee': formData.tuitionFee };
        result = await addStudent(dataToAdd);
      }
      showToast(result.message);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      await refreshData();
      setPageLoading(false);
      setStudentToEdit(null);
    }
  };

   const confirmDelete = async () => {
    setDeleteModalOpen(false);
    setPageLoading(true);
    try {
      const result = await deleteStudent(studentToDelete);
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
      const studentsToDelete = students.filter(s => selectedStudents.includes(s.id));
      const result = await deleteMultipleStudents(studentsToDelete);
      showToast(result.message);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      await refreshData();
      setSelectedStudents([]);
      setPageLoading(false);
    }
  };

  
  const handleAddNewClick = () => { setStudentToEdit(null); setFormModalOpen(true); };
  const handleEditClick = (student) => { setStudentToEdit(student); setFormModalOpen(true); };
  const handleDeleteClick = (student) => { setStudentToDelete(student); setDeleteModalOpen(true); };
  const handleSelectAll = (e) => setSelectedStudents(e.target.checked ? students.map(s => s.id) : []);
  const handleSelectStudent = (id) => setSelectedStudents(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);

  if (contextLoading) {
    return (
      <div className="student-list-container">
        <div className="toolbar-placeholder">
          <div className="skeleton-button large"></div>
          <div className="toolbar-right-placeholder">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
        <div className="student-grid">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </div>
    );
  }

  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="student-list-container">
      {pageLoading && <div className="loading-overlay"><span>Updating Sheet...</span></div>}
      <SuccessToast isVisible={toastInfo.isVisible} message={toastInfo.message} onClose={() => setToastInfo({ isVisible: false, message: '' })} />
      <StudentFormModal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} onSave={handleSaveStudent} student={studentToEdit} />
      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} studentName={studentToDelete?.name} />

      <div className="toolbar">
        <h1 className="page-title">Student List</h1>
        <div className="toolbar-actions">
          <Button variant="secondary" onClick={() => refreshData().then(() => showToast('List refreshed!'))}>
            <FaSync /> Refresh List
          </Button>
          <Button variant="danger" onClick={handleDeleteSelected}>
            <FaTrash /> Delete Selected
          </Button>
          <Button variant="primary" onClick={handleAddNewClick}>
            <FaPlus /> Add New Student
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
            <img src={newAvatar} alt="Student Avatar" className="student-avatar-img" />
            <h3 className="student-name">{student.name}</h3>
            <p className="student-id">{student.id}</p>
            <div className="student-details">
              <p><strong>Class:</strong> {student.class}</p>
              <p><strong>Section:</strong> {student.section}</p>
              <p><strong>Tuition Fee:</strong> ${student.tuitionFee}</p>
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
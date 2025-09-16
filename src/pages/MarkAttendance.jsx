import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { recordAttendance } from '../services/googleSheetService';
import Button from '../components/Button';
import SuccessToast from '../components/SuccessToast';
import './MarkAttendance.css';

const MarkAttendance = () => {
  // --- Central State from Context ---
  const { students, attendance, loading: contextLoading, error, refreshData } = useData();

  // --- UI State for this page ---
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todaysAttendance, setTodaysAttendance] = useState({});
  const [toastInfo, setToastInfo] = useState({ isVisible: false, message: '' });

  const showToast = (message) => setToastInfo({ isVisible: true, message });

  // --- Initial Data Load ---
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Syncs the radio buttons with saved data when the date or master attendance log changes
  useEffect(() => {
    const recordsForDate = attendance[selectedDate] || [];
    const statusMap = recordsForDate.reduce((acc, record) => {
      acc[record.studentId] = record.status;
      return acc;
    }, {});
    setTodaysAttendance(statusMap);
  }, [selectedDate, attendance]);

  const handleStatusChange = (studentId, status) => {
    setTodaysAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    setPageLoading(true);
    const recordsToSave = students.map(student => ({
      studentId: student.id,
      status: todaysAttendance[student.id] || 'P' // Default to Present if untouched
    }));

    try {
      // --- PERMANENT ATTENDANCE RECORDING ---
      const result = await recordAttendance({ date: selectedDate, records: recordsToSave });
      showToast(result.message);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      await refreshData(); // Refresh all data to get latest attendance records
      setPageLoading(false);
    }
  };

  const calculateTotalPresents = (studentId) => {
    return Object.values(attendance).reduce((acc, dailyRecords) => {
      const record = dailyRecords.find(r => r.studentId === studentId && r.status === 'P');
      return acc + (record ? 1 : 0);
    }, 0);
  };

  const getStudentStatus = (studentId) => todaysAttendance[studentId] || 'P';

  const presentCount = Object.values(todaysAttendance).filter(s => s === 'P').length;
  const absentCount = Object.values(todaysAttendance).filter(s => s === 'A').length;
  const leaveCount = Object.values(todaysAttendance).filter(s => s === 'L').length;

  // --- Render Logic ---
  if (contextLoading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading data from Google...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="attendance-container">
      {pageLoading && <div className="loading-overlay"><span>Saving Attendance...</span></div>}
      <SuccessToast isVisible={toastInfo.isVisible} message={toastInfo.message} onClose={() => setToastInfo({ isVisible: false, message: '' })} />
      <h2>Mark Full Attendance</h2>
      <div className="attendance-card">
        <label htmlFor="attendance-date" className="date-label">Select Attendance Date:</label>
        <input type="date" id="attendance-date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="date-input" />

        <div className="stats-bar">
          <span>Total: {students.length}</span>
          <span className="present">Present: {presentCount}</span>
          <span className="absent">Absent: {absentCount}</span>
          <span className="leave">Leave: {leaveCount}</span>
        </div>

        <div className="attendance-table">
          <div className="table-header">
            <span>Student Name</span>
            <span>Total Presents</span>
            <span>Status Today (P / A / L)</span>
          </div>
          {students.map(student => (
            <div className="table-row" key={student.id}>
              <div className="student-info">
                 <div className="name-wrapper">
                    <img src="/src/assets/avatar-placeholder.png" alt="avatar" />
                    <span>{student.name}</span>
                </div>
                <div className="total-presents">
                  {calculateTotalPresents(student.id)}
                </div>
              </div>
             
              <div className="status-selector">
                {['P', 'A', 'L'].map(status => (
                  <label key={status}>
                    <input type="radio" name={`status-${student.id}`} value={status} checked={getStudentStatus(student.id) === status} onChange={() => handleStatusChange(student.id, status)} />
                    <span className={`status-label status-${status.toLowerCase()}`}>{status}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="submit-action">
            <Button variant="primary" onClick={handleSubmit}>Submit Attendance</Button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;

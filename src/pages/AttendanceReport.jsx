import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import './AttendanceReport.css';

const AttendanceReport = () => {
  // --- Central State from Context ---
  const { students, attendance, loading, error, refreshData } = useData();

  // --- UI State for this page ---
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1); // Default start date: one month ago
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Default end date: today

  // --- Initial Data Load ---
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // --- Memoized Calculation for Report ---
  const reportData = useMemo(() => {
    return students.map(student => {
      let present = 0, absent = 0, leave = 0;
      Object.entries(attendance).forEach(([date, records]) => {
        if (date >= startDate && date <= endDate) {
          const record = records.find(r => r.studentId === student.id);
          if (record) {
            if (record.status === 'P') present++;
            else if (record.status === 'A') absent++;
            else if (record.status === 'L') leave++;
          }
        }
      });
      return { ...student, present, absent, leave };
    });
  }, [students, attendance, startDate, endDate]);

  // --- Render Logic ---
  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading report data...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="report-container">
      <h2>Student Attendance Report</h2>
      <div className="report-card">
        <div className="date-filters">
          <div>
            <label htmlFor="start-date">Start Date:</label>
            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="date-input" />
          </div>
          <div>
            <label htmlFor="end-date">End Date:</label>
            <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="date-input" />
          </div>
        </div>

        <div className="report-table">
          <div className="report-header">
            <span>Student Name</span>
            <span>Total Present</span>
            <span>Total Absent</span>
            <span>Total Leave</span>
          </div>
          {reportData.map(student => (
            <div className="report-row" key={student.id}>
              <div className="student-name-report">{student.name}</div>
              <div>
                <span className="stat-label">Total Present:</span>
                <span className="stat-value count-present">{student.present}</span>
              </div>
              <div>
                <span className="stat-label">Total Absent:</span>
                <span className="stat-value count-absent">{student.absent}</span>
              </div>
               <div>
                <span className="stat-label">Total Leave:</span>
                <span className="stat-value count-leave">{student.leave}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;

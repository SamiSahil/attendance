import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import './StudentReport.css';

const StudentReport = () => {
  const { students, attendance, payments, loading, error, refreshData } = useData();

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const reportData = useMemo(() => {
    return students.map(student => {
      let present = 0, absent = 0, leave = 0, totalPaid = 0;

      // Calculate Attendance
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

      // Calculate Payments
      Object.entries(payments).forEach(([date, records]) => {
        if (date >= startDate && date <= endDate) {
          const paymentRecord = records.find(r => r.studentId === student.id);
          if (paymentRecord) {
            totalPaid += Number(paymentRecord.amount);
          }
        }
      });
      
      const due = student.tuitionFee - totalPaid;

      return { ...student, present, absent, leave, totalPaid, due };
    });
  }, [students, attendance, payments, startDate, endDate]);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading report data...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="report-container">
      <h2>Student Report</h2>
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
            <span>Present</span>
            <span>Absent</span>
            <span>Tuition Fee</span>
            <span>Paid</span>
            <span>Dues</span>
          </div>
          {reportData.map(student => (
            <div className="report-row" key={student.id}>
              <div className="student-name-report">{student.name}</div>
              <div><span className="stat-label">Present:</span><span className="stat-value count-present">{student.present}</span></div>
              <div><span className="stat-label">Absent:</span><span className="stat-value count-absent">{student.absent}</span></div>
              <div><span className="stat-label">Fee:</span><span className="stat-value">{student.tuitionFee} BDT</span></div>
              <div><span className="stat-label">Paid:</span><span className="stat-value count-present">{student.totalPaid} BDT</span></div>
              <div><span className="stat-label">Dues:</span><span className={`stat-value ${student.due > 0 ? 'count-absent' : ''}`}>{student.due} BDT</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentReport;

import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { recordPayment } from '../services/googleSheetService';
import Button from '../components/Button';
import SuccessToast from '../components/SuccessToast';
import './MarkAttendance.css'; // Reusing styles

const RecordPayment = () => {
  const { students, payments, loading: contextLoading, error, refreshData } = useData();
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentRecords, setPaymentRecords] = useState({});
  const [toastInfo, setToastInfo] = useState({ isVisible: false, message: '' });

  const showToast = (message) => setToastInfo({ isVisible: true, message });

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const recordsForDate = payments[selectedDate] || [];
    const statusMap = recordsForDate.reduce((acc, record) => {
      acc[record.studentId] = record.amount;
      return acc;
    }, {});
    setPaymentRecords(statusMap);
  }, [selectedDate, payments]);

  const handleAmountChange = (studentId, amount) => {
    setPaymentRecords(prev => ({ ...prev, [studentId]: Number(amount) }));
  };

  const handleSubmit = async () => {
    setPageLoading(true);
    const recordsToSave = Object.entries(paymentRecords)
      .filter(([, amount]) => amount > 0)
      .map(([studentId, amount]) => ({ studentId, amount }));

    if (recordsToSave.length === 0) {
      showToast("No payments entered to save.");
      setPageLoading(false);
      return;
    }

    try {
      const result = await recordPayment({ date: selectedDate, records: recordsToSave });
      showToast(result.message);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      await refreshData();
      setPageLoading(false);
    }
  };

  if (contextLoading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="attendance-container">
      {pageLoading && <div className="loading-overlay"><span>Saving Payments...</span></div>}
      <SuccessToast isVisible={toastInfo.isVisible} message={toastInfo.message} onClose={() => setToastInfo({ isVisible: false, message: '' })} />
      <h2>Record Student Payments</h2>
      <div className="attendance-card">
        <label htmlFor="payment-date" className="date-label">Select Payment Date:</label>
        <input type="date" id="payment-date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="date-input" />

        <div className="attendance-table">
          <div className="table-header">
            <span>Student Name</span>
            <span>Tuition Fee</span>
            <span>Amount Paid Today</span>
          </div>
          {students.map(student => (
            <div className="table-row" key={student.id}>
              <div className="student-info">
                 <div className="name-wrapper">
                    <span>{student.name}</span>
                </div>
              </div>
              <div className="total-presents-desktop">
                ${student.tuitionFee}
              </div>
              <div className="status-selector">
                <input
                  type="number"
                  placeholder="0.00"
                  className="form-input"
                  value={paymentRecords[student.id] || ''}
                  onChange={(e) => handleAmountChange(student.id, e.target.value)}
                  style={{ maxWidth: '120px' }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="submit-action">
            <Button variant="primary" onClick={handleSubmit}>Submit Payments</Button>
        </div>
      </div>
    </div>
  );
};

export default RecordPayment;
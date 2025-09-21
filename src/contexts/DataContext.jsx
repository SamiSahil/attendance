import React, { createContext, useState, useCallback, useContext } from 'react';
import { getInitialData } from '../services/googleSheetService';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [payments, setPayments] = useState({}); // <-- ADDED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInitialData();
      
      const formattedStudents = data.students.map(s => ({
        id: s.ID, name: s.Name, class: s.Class, section: s.Section, email: s.Email,
        phone: s.Phone, guardian: s['Guardian Name'], photoUrl: s['Photo URL'],
        tuitionFee: s['Tuition Fee'] || 0, // <-- ADDED
        rowIndex: s.rowIndex
      }));
      
      setStudents(formattedStudents);
      setAttendance(data.attendance || {});
      setPayments(data.payments || {}); // <-- ADDED
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    students,
    attendance,
    payments,
    loading,
    error,
    refreshData: fetchData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
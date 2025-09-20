import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import StudentList from './pages/StudentList';
import MarkAttendance from './pages/MarkAttendance';
import RecordPayment from './pages/RecordPayment'; // <-- ADDED
import StudentReport from './pages/StudentReport';   // <-- RENAMED

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<AppLayout><StudentList /></AppLayout>} />
      <Route path="/attendance" element={<AppLayout><MarkAttendance /></AppLayout>} />
      <Route path="/payments" element={<AppLayout><RecordPayment /></AppLayout>} /> {/* <-- ADDED */}
      <Route path="/report" element={<AppLayout><StudentReport /></AppLayout>} />   {/* <-- RENAMED */}
    </Routes>
  );
};

export default AppRoutes;
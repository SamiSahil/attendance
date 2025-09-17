import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import StudentList from './pages/StudentList';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceReport from './pages/AttendanceReport';

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs only ONCE when the application first loads or is reloaded.
    // The empty dependency array `[]` ensures this.

    // We check if the current path is anything other than the main page ("/").
    if (location.pathname !== '/') {
      // If it is a sub-page (like "/report" or "/attendance"),
      // we programmatically navigate the user back to the main page.
      // `replace: true` ensures the back button doesn't go to the old page.
      navigate('/', { replace: true });
    }
  }, []); // The empty array is the most important part of this logic.

  // This is your existing route structure.
  return (
    <Routes>
      <Route path="/" element={<AppLayout><StudentList /></AppLayout>} />
      <Route path="/attendance" element={<AppLayout><MarkAttendance /></AppLayout>} />
      <Route path="/report" element={<AppLayout><AttendanceReport /></AppLayout>} />
    </Routes>
  );
};

export default AppRoutes;
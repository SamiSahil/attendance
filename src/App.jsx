import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import AppLayout from './components/AppLayout';
import StudentList from './pages/StudentList';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceReport from './pages/AttendanceReport';

function App() {
  return (
    <DataProvider>
      <div className="app">
        <BrowserRouter basename="/attendance">
          <Routes>
            <Route path="/" element={<AppLayout><StudentList /></AppLayout>} />
            <Route path="/attendance" element={<AppLayout><MarkAttendance /></AppLayout>} />
            <Route path="/report" element={<AppLayout><AttendanceReport /></AppLayout>} />
          </Routes>
        </BrowserRouter>
      </div>
    </DataProvider>
  );
}

export default App;
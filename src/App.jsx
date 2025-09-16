// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext'; // Import the provider
import AppLayout from './components/AppLayout';
import StudentList from './pages/StudentList';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceReport from './pages/AttendanceReport';

function App() {
  return (
    <DataProvider> {/* Wrap the entire application */}
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<StudentList />} />
              <Route path="attendance" element={<MarkAttendance />} />
              <Route path="report" element={<AttendanceReport />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </DataProvider>
  );
}

export default App;
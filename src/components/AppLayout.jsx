import { NavLink } from 'react-router-dom';
import './AppLayout.css';

// The `children` prop will be the page component we want to display (e.g., <StudentList />)
const AppLayout = ({ children }) => (
  <div>
    <nav className="navbar"> 
      <NavLink to="/">Student List</NavLink>
      <NavLink to="/attendance">Mark Attendance</NavLink>
      <NavLink to="/report">Attendance Report</NavLink>
    </nav>
    <main className="content">
      {/* Instead of an <Outlet />, we now directly render the child page */}
      {children}
    </main>
  </div>
);

export default AppLayout;
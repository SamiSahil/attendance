import { NavLink } from 'react-router-dom';
import './AppLayout.css';

const AppLayout = ({ children }) => (
  <div>
    <nav className="navbar">
           <NavLink to="/">Student List</NavLink>
      <NavLink to="/attendance">Mark Attendance</NavLink>
      <NavLink to="/report">Attendance Report</NavLink>
    </nav>
    <main className="content">
     
      {children}
    </main>
  </div>
);

export default AppLayout;
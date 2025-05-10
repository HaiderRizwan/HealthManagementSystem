import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside>
      <div className="profile-picture">
        {/* Profile picture */}
      </div>
      <nav>
        <ul>
          <li><Link to="/profile/overview">Overview</Link></li>
          <li><Link to="/profile/appointments">Appointments</Link></li>
          <li><Link to="/profile/medical-records">Medical Records</Link></li>
          <li><Link to="/profile/notifications">Notifications</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

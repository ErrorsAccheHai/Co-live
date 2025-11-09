// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaClipboardList, FaUsers, FaKey, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('colive_token');
    localStorage.removeItem('colive_user');
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { to: '/profile', label: 'Profile', icon: <FaUserCircle /> },
  ];

  if (role === 'tenant') {
    links.push({ to: '/requests', label: 'Requests', icon: <FaClipboardList /> });
  }

  if (role === 'landlord') {
    links.push(
      { to: '/properties', label: 'Properties', icon: <FaKey /> },
      { to: '/tenants', label: 'Tenants', icon: <FaUsers /> }
    );
  }

  if (role === 'admin') {
    links.push(
      { to: '/admin/dashboard', label: 'Verification', icon: <FaClipboardList /> },
      { to: '/properties', label: 'Properties', icon: <FaKey /> },
      { to: '/users', label: 'Users', icon: <FaUsers /> }
    );
  }

  return (
    <div
      className="col-2 min-vh-100 text-white p-0 d-flex flex-column justify-content-between"
      style={{
        background: 'linear-gradient(45deg, #ff4d4d, #ff6b6b)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
      }}
    >
      <div className="p-3">
        <h4 className="text-center mb-4">Co-Live</h4>
        <nav className="nav flex-column">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="nav-link text-white mb-2 d-flex align-items-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '8px 12px',
              }}
            >
              {icon} {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="btn text-white w-100 d-flex align-items-center justify-content-center gap-2"
          style={{
            border: '1px solid rgba(255,255,255,0.4)',
            background: 'transparent',
            borderRadius: '10px',
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

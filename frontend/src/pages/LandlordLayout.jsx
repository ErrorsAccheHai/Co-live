// src/pages/LandlordLayout.jsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

export default function LandlordLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('colive_token');
    localStorage.removeItem('colive_user');
    navigate('/login');
  };

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
        {/* Sidebar */}
        <div className="col-2 min-vh-100 bg-dark text-white d-flex flex-column justify-content-between p-3">
          <div>
            <h5 className="text-center mb-4">Co-Live</h5>
            <nav className="nav flex-column">
              <Link className="nav-link text-white" to="/landlord/dashboard">Overview</Link>
              <Link className="nav-link text-white" to="/landlord/dashboard/my-properties">My Properties</Link>
              <Link className="nav-link text-white" to="/landlord/dashboard/requests">Requests</Link>
              <Link className="nav-link text-white" to="/profile">Profile</Link>
            </nav>
          </div>

          {/* Logout button */}
          <button
            className="btn btn-outline-light d-flex align-items-center gap-2 mt-3"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="col-10 bg-light min-vh-100 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

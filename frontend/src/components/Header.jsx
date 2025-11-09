// src/components/Header.jsx
import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = ({ user }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h2 className="mb-1">Welcome, {user?.name}!</h2>
      <p className="text-muted mb-0">Here’s what’s happening in your account today.</p>
    </div>
    <div className="d-flex gap-3 align-items-center">
      <button
        className="btn position-relative"
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
        }}
      >
        <FaBell className="text-dark" />
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
          style={{ background: '#ff4d4d' }}
        >
          0
        </span>
      </button>
      <Link
        to="/profile"
        className="btn text-white"
        style={{
          background: '#ff4d4d',
          borderRadius: '10px',
        }}
      >
        <FaUserCircle className="me-2" /> Profile
      </Link>
    </div>
  </div>
);

export default Header;

// src/pages/TenantDashboardContent.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaHome, FaClock } from 'react-icons/fa';

export default function TenantDashboardContent() {
  return (
    <>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div
            className="card h-100 border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
            }}
          >
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center gap-2">
                <FaClipboardList /> My Requests
              </h5>
              <p className="display-5 fw-bold">—</p>
              <Link
                to="/requests"
                className="btn text-white"
                style={{ background: '#ff4d4d', borderRadius: '10px' }}
              >
                View Requests
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card h-100 border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
            }}
          >
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center gap-2">
                <FaClock /> Pending Actions
              </h5>
              <p className="display-5 fw-bold">—</p>
              <button
                className="btn"
                style={{
                  border: '2px solid #ff4d4d',
                  color: '#ff4d4d',
                  borderRadius: '10px',
                }}
              >
                Track Status
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card h-100 border-0 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
            }}
          >
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center gap-2">
                <FaHome /> Recent Activity
              </h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0 text-muted">No recent activity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// src/pages/AdminDashboardContent.jsx
import React from 'react';
import AdminDashboard from './AdminDashboard';
import { FaUsers, FaBuilding, FaChartLine } from 'react-icons/fa';

export default function AdminDashboardContent() {
  return (
    <>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center gap-2">
                <FaUsers /> Total Users
              </h5>
              <p className="display-5 fw-bold">—</p>
              <p className="text-muted mb-0">All registered tenants and landlords.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center gap-2">
                <FaBuilding /> Properties Listed
              </h5>
              <p className="display-5 fw-bold">—</p>
              <p className="text-muted mb-0">Total properties pending or verified.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center gap-2">
                <FaChartLine /> System Health
              </h5>
              <div className="text-success mt-3">
                <span className="badge bg-success me-2">Active</span> All systems operational
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminDashboard />
    </>
  );
}

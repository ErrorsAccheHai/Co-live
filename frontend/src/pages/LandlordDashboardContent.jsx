// src/pages/LandlordDashboardContent.jsx
import React from 'react';
import MyProperties from './MyProperties';
import Requests from './Requests';

export default function LandlordDashboardContent() {
  return (
    <>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">My Properties</h5>
              <p className="display-5 fw-bold">—</p>
              <p className="text-muted">Manage all your listed properties.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Requests</h5>
              <p className="display-5 fw-bold">—</p>
              <p className="text-muted">Tenant maintenance requests.</p>
            </div>
          </div>
        </div>
      </div>

      <MyProperties />
      <Requests />
    </>
  );
}

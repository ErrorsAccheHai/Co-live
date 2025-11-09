// src/pages/LandlordDashboardMain.jsx
import React, { useEffect, useState } from 'react';
import MyProperties from './MyProperties'; // your Chakra-based component (works inside a bootstrap layout)
import Requests from './Requests';
import Profile from './Profile';
import { Link } from 'react-router-dom';

export default function LandlordDashboardMain() {
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [propertiesCount, setPropertiesCount] = useState(0);

  // light polling to update counts (optional)
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // best to replace these with actual endpoints if you have them:
        const token = localStorage.getItem('colive_token');
        // attempt to fetch landlord stats endpoints if exist:
        // const res = await fetch('/api/landlord/stats', { headers: { Authorization: `Bearer ${token}` } });
        // const data = await res.json();
        // setPendingRequestsCount(data.pendingRequests);
        // setPropertiesCount(data.totalProperties);
      } catch (e) {
        // ignore silently — counts are placeholders until backend endpoints wired
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
        {/* Sidebar */}
        <div className="col-2 min-vh-100 bg-dark text-white p-3">
          <h5 className="text-center">Co-Live</h5>
          <nav className="nav flex-column mt-4">
            <Link className="nav-link text-white" to="/landlord/dashboard#overview">Overview</Link>
            <Link className="nav-link text-white" to="/landlord/dashboard#properties">My Properties</Link>
            <Link className="nav-link text-white" to="/landlord/dashboard#requests">Requests</Link>
            <Link className="nav-link text-white" to="/landlord/dashboard#tenants">Tenants</Link>
            <Link className="nav-link text-white" to="/profile">Profile</Link>
          </nav>
        </div>

        {/* Main */}
        <div className="col-10" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2>Landlord Dashboard</h2>
                <p className="text-muted mb-0">Manage your properties, tenants and requests.</p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="text-end">
                  <small className="text-muted">Pending</small>
                  <div className="fw-bold">{pendingRequestsCount}</div>
                </div>
                <div className="text-end">
                  <small className="text-muted">Properties</small>
                  <div className="fw-bold">{propertiesCount}</div>
                </div>
                <Link to="/profile" className="btn btn-sm" style={{ background: '#ff4d4d', color: 'white' }}>Profile</Link>
              </div>
            </div>

            {/* Overview cards */}
            <div id="overview" className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="card-title">My Properties</h6>
                    <h3>{propertiesCount}</h3>
                    <p className="card-text text-muted">Properties listed under your account.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="card-title">Pending Requests</h6>
                    <h3>{pendingRequestsCount}</h3>
                    <p className="card-text text-muted">Requests awaiting action.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="card-title">Tenants</h6>
                    <h3>—</h3>
                    <p className="card-text text-muted">Total tenants linked to your properties.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Properties (reuses your Chakra MyProperties component) */}
            <div id="properties" className="mb-4">
              <MyProperties />
            </div>

            {/* Requests */}
            <div id="requests" className="mb-4">
              <Requests />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

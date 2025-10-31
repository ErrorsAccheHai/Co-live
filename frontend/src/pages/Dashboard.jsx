import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaUserCircle, FaSignOutAlt, FaBell, FaClipboardList, FaUsers, FaKey } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const tokenKey = 'colive_token';

const DashboardSkeleton = () => (
  <div className="container-fluid p-0">
    <div className="row m-0">
      {/* Sidebar Skeleton */}
      <div className="col-2 min-vh-100 bg-dark p-0">
        <div className="d-flex flex-column gap-4 p-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-secondary bg-opacity-25 rounded" style={{ height: "40px" }}></div>
          ))}
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="col-10 bg-light p-4">
        <div className="row">
          {/* Header Skeleton */}
          <div className="col-12 mb-4">
            <div className="bg-secondary bg-opacity-25 rounded" style={{ height: "60px" }}></div>
          </div>
          
          {/* Cards Skeleton */}
          <div className="col-12">
            <div className="row g-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="col-md-4">
                  <div className="bg-secondary bg-opacity-25 rounded p-4" style={{ height: "200px" }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem(tokenKey);
        const res = await axios.get(`http://localhost:5000/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        // Simulate loading time for demo
        setTimeout(() => setLoading(false), 1000);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const logout = () => {
    localStorage.removeItem(tokenKey);
    window.location.href = '/login';
  };

  if (loading || !user) return <DashboardSkeleton />;

  const renderContent = () => {
    switch (user.role) {
      case 'tenant':
        return (
          <>
            <div className="row g-4">
              <div className="col-md-4">
                <div 
                  className="card h-100 border-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">My Requests</h5>
                    <p className="display-4">{stats.totalRequests}</p>
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
                  className="card h-100 border-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Pending</h5>
                    <p className="display-4">{stats.pendingRequests}</p>
                    <button 
                      className="btn"
                      style={{ 
                        border: '2px solid #ff4d4d',
                        color: '#ff4d4d',
                        borderRadius: '10px'
                      }}
                    >
                      Track Status
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div 
                  className="card h-100 border-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">Recent Activity</h5>
                    <div className="list-group list-group-flush">
                      <div className="list-group-item border-0">No recent activities</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'landlord':
        return (
          <>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Properties</h5>
                    <p className="display-4">0</p>
                    <button className="btn btn-primary">Add Property</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Tenants</h5>
                    <p className="display-4">0</p>
                    <Link to="/tenants" className="btn btn-outline-primary">View All</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Pending Requests</h5>
                    <p className="display-4">{stats.pendingRequests}</p>
                    <Link to="/requests" className="btn btn-outline-primary">View All</Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'admin':
        return (
          <>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Total Users</h5>
                    <p className="display-4">0</p>
                    <Link to="/users" className="btn btn-primary">Manage Users</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Properties</h5>
                    <p className="display-4">0</p>
                    <Link to="/properties" className="btn btn-outline-primary">View All</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">System Status</h5>
                    <div className="text-success">
                      <span className="badge bg-success me-2">Active</span>
                      All systems operational
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
        {/* Sidebar */}
        <div 
          className="col-2 min-vh-100 text-white p-0"
          style={{
            background: 'linear-gradient(45deg, #ff4d4d, #ff6b6b)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="d-flex flex-column p-3">
            <h4 className="mb-4 text-center">Co-Live</h4>
            <nav className="nav nav-pills flex-column gap-2">
              <Link 
                to="/dashboard" 
                className="nav-link text-white"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  marginBottom: '5px',
                  borderRadius: '10px'
                }}
              >
                <FaHome className="me-2" /> Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="nav-link text-white"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  marginBottom: '5px',
                  borderRadius: '10px'
                }}
              >
                <FaUserCircle className="me-2" /> Profile
              </Link>
              {user.role === 'tenant' && (
                <Link to="/requests" className="nav-link text-white">
                  <FaClipboardList className="me-2" /> Requests
                </Link>
              )}
              {user.role === 'landlord' && (
                <>
                  <Link to="/properties" className="nav-link text-white">
                    <FaKey className="me-2" /> Properties
                  </Link>
                  <Link to="/tenants" className="nav-link text-white">
                    <FaUsers className="me-2" /> Tenants
                  </Link>
                </>
              )}
              <button onClick={logout} className="nav-link text-white mt-auto">
                <FaSignOutAlt className="me-2" /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-10 min-vh-100" style={{ background: '#f8f9fa' }}>
          <div 
            className="p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(10px)',
              minHeight: '100vh'
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">Welcome, {user.name}!</h2>
                <p className="text-muted mb-0">Here's what's happening in your account today.</p>
              </div>
              <div className="d-flex gap-3">
                <button 
                  className="btn position-relative"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '10px'
                  }}
                >
                  <FaBell className="text-dark" />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: '#ff4d4d' }}>
                    0
                  </span>
                </button>
                <Link 
                  to="/profile" 
                  className="btn text-white"
                  style={{
                    background: '#ff4d4d',
                    borderRadius: '10px'
                  }}
                >
                  <FaUserCircle className="me-2" />
                  Profile
                </Link>
              </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

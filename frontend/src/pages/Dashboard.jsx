// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TenantDashboardContent from './TenantDashboardContent';
import LandlordDashboardContent from './LandlordDashboardContent';
import AdminDashboardContent from './AdminDashboardContent';
import 'bootstrap/dist/css/bootstrap.min.css';

const tokenKey = 'colive_token';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem(tokenKey);
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Unauthorized. Please log in again.</p>;

  const renderContent = () => {
    switch (user.role) {
      case 'tenant':
        return <TenantDashboardContent user={user} />;
      case 'landlord':
        return <LandlordDashboardContent user={user} />;
      case 'admin':
        return <AdminDashboardContent user={user} />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row m-0">
        <Sidebar role={user.role} />
        <div className="col-10 min-vh-100 p-4" style={{ background: '#f8f9fa' }}>
          <Header user={user} />
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public pages
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';

// Tenant pages
import Dashboard from './pages/Dashboard';

// Admin + Landlord layouts
import AdminDashboardMain from './pages/AdminDashboardMain';
import LandlordDashboardMain from './pages/LandlordDashboardMain';

// Shared / common pages
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import Properties from './pages/Properties';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Tenant Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Landlord Dashboard (Bootstrap layout) */}
      <Route
        path="/landlord/dashboard"
        element={
          <ProtectedRoute>
            <LandlordDashboardMain />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard (Chakra layout) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardMain />
          </ProtectedRoute>
        }
      />

      {/* Shared pages */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

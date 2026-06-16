import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';

const tokenKey = 'colive_token';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem(tokenKey);
  const location = useLocation();

  // No token → redirect to login
  if (!token) return <Navigate to="/login" replace />;

  const user = getUserFromToken();
  const role = user?.role;
  const path = location.pathname;

  // Role-based route guards — redirect to the correct dashboard
  if (path === '/dashboard' && role !== 'tenant') {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'landlord') return <Navigate to="/landlord/dashboard" replace />;
  }

  if (path.startsWith('/admin') && role !== 'admin') {
    if (role === 'landlord') return <Navigate to="/landlord/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  if (path.startsWith('/landlord') && role !== 'landlord') {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const tokenKey = 'colive_token';
const userKey = 'colive_user';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem(tokenKey);
  const user = JSON.parse(localStorage.getItem(userKey));
  const location = useLocation();

  // No token → redirect to login
  if (!token) return <Navigate to="/login" replace />;

  // Admin route accessed by non-admin user
  if (location.pathname.startsWith('/admin') && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

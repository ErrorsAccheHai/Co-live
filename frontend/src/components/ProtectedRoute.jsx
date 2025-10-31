import React from 'react';
import { Navigate } from 'react-router-dom';
import { Button, TextField, Container, Typography } from '@mui/material';

const tokenKey = 'colive_token';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem(tokenKey);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

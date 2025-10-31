import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import Properties from './pages/Properties';
import MyProperties from './pages/MyProperties';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/my-properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/terms" element={<div className="p-5"><h1>Terms of Service</h1><p>Coming soon...</p></div>} />
      <Route path="/privacy" element={<div className="p-5"><h1>Privacy Policy</h1><p>Coming soon...</p></div>} />
      <Route path="/contact" element={<div className="p-5"><h1>Contact Us</h1><p>Coming soon...</p></div>} />
      <Route path="/about" element={<div className="p-5"><h1>About Us</h1><p>Coming soon...</p></div>} />
      <Route path="*" element={<div className="p-5 text-center"><h1>404</h1><p>Page not found</p></div>} />
    </Routes>
  );
}

export default App;

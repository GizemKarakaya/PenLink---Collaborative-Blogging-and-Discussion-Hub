import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('role');
  
  // If no role is found, redirect to login
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // Check if user's role is allowed to access this route
  if (!allowedRoles.includes(userRole)) {
    // Redirect based on role
    if (userRole === 'USER') {
      return <Navigate to="/user" replace />;
    } else if (userRole === 'ADMIN' || userRole === 'HR') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If role is allowed, render the protected component
  return children;
};

export default ProtectedRoute; 
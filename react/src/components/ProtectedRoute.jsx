import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { access } = useAuth();
  const location = useLocation();

  if (!access) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <div data-easytag="id1-src/components/ProtectedRoute.jsx">{children}</div>;
}

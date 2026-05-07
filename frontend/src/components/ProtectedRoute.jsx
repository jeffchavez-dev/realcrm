import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{borderWidth:3}}/>
        <p className="text-sm text-gray-500">Loading RealCRM...</p>
      </div>
    </div>
  );

  return user ? children : <Navigate to="/login" replace />;
}

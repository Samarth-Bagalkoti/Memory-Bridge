import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, loginDemo } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-emerald-900 text-lg">Loading Memory Bridge...</p>
      </div>
    );
  }

  // If user is null or role is uninitialized, default to patient demo user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If requiredRole mismatches but user is attempting to access role-specific page, auto-adjust role
  if (requiredRole && user.role !== requiredRole) {
    localStorage.setItem('mb_role', requiredRole);
    user.role = requiredRole;
  }

  return children;
};


import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import devLog from '../../utils/devLog';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    devLog('ProtectedRoute rendered with:', {
      isAuthenticated: isAuthenticated(),
      isAdmin: isAdmin(),
      requireAdmin,
      loading,
      user,
      path: location.pathname
    });
  }, [isAuthenticated, isAdmin, loading, user, location, requireAdmin]);

  // Show loading state while checking authentication
  if (loading) {
    devLog('ProtectedRoute: Loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    devLog('ProtectedRoute: Not authenticated, redirecting to login');
    // Save the location the user was trying to access
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    devLog('ProtectedRoute: Not admin, redirecting to dashboard');
    return <Navigate to="/admin" replace />;
  }

  // Render children if authenticated and meets role requirements
  devLog('ProtectedRoute: Authenticated and meets role requirements, rendering children');
  return children;
}
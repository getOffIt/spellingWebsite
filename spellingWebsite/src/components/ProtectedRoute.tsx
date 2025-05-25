import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    // Optionally, you can trigger login here:
    auth.signinRedirect();
    return null;
    // Or, if you want to use a redirect:
    // return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 
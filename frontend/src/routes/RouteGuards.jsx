import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isValidating } = useAuth();

  // Show nothing while validating token (prevents flash of login page)
  if (isValidating) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-body">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, isValidating } = useAuth();

  if (isValidating) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated, isValidating } = useAuth();

  if (isValidating) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

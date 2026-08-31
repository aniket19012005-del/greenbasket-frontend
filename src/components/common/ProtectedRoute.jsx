import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { LoadingState, AccessDenied } from './States';

// NOTE: This only hides/redirects the UI. The backend must independently
// enforce authorization on every request — the frontend check is a UX
// convenience, never the actual security boundary.
export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, role: userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState label="Checking your session…" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  if (role && !allowedRoles.includes(userRole)) {
    return <AccessDenied />;
  }

  return children;
}

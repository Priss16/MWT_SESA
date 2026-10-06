import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards a route so that:
 *  1. Nobody gets in without being logged in (-> /login)
 *  2. A logged-in user can only see pages that belong to THEIR role.
 *     e.g. a Student who manually types /admin/dashboard into the
 *     address bar gets bounced to their own dashboard instead, not
 *     the admin one.
 *
 * Usage: <ProtectedRoute allowedRoles={['admin']}>...</ProtectedRoute>
 * If allowedRoles is omitted, any logged-in role is allowed through
 * (not currently used, but kept flexible for shared pages).
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, checkingSession } = useAuth();

  if (checkingSession) {
    return <p style={{ padding: 40 }}>Checking session…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong role for this section -> send them home
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
}

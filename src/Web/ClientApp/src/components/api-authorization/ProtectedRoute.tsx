import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <p><em>Cargando...</em></p>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  return <>{children}</>;
}

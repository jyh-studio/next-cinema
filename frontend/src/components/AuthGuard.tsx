import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils } from '@/utils/auth';

interface AuthGuardProps {
  children: ReactNode;
  requireMembership?: boolean;
}

const AuthGuard = ({ children, requireMembership = false }: AuthGuardProps) => {
  const isAuthenticated = authUtils.isAuthenticated();
  const user = authUtils.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireMembership && (!user?.isMember)) {
    return <Navigate to="/membership" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
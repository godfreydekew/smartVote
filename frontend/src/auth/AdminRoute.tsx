import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user_role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export { AdminRoute};
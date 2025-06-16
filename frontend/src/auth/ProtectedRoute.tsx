import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { BlockchainSpinner } from '@/components/ui/BlockchainSpinner';
import { Connect } from '@/components/thirdweb/Connect';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute', { isAuthenticated, user });
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BlockchainSpinner size="lg" className="mb-4" />
          <Connect/>
          <p className="text-gray-600 text-sm">Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user.kyc_session_id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

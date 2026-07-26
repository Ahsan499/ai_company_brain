import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
      <div
        className="h-9 w-9 rounded-full border-2 border-primary/25 border-t-primary animate-spin"
        aria-hidden
      />
      <p className="text-sm text-secondaryText">Checking session…</p>
    </div>
  );
}

/**
 * Guards /dashboard/* routes. Unauthenticated users → /auth.
 * While AuthProvider hydrates an in-memory token, shows a spinner (no flash redirect).
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

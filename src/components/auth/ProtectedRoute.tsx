// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireVerified?: boolean;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  requireVerified = false,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for AuthContext to restore session
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // Not logged in -> send to login + remember previous URL
  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: { pathname: location.pathname } }}
      />
    );
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Verification check
  if (requireVerified && user.verification_status !== "verified") {
    return <Navigate to="/verification-pending" replace />;
  }

  return <>{children}</>;
};

import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface GuestRouteProps {
  children: ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can replace this with a proper loading component
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/starting-numbers" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;

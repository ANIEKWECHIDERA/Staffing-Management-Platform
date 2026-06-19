import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export function ProtectedRoute() {
  const { appUser, isLoading, session } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-[1.5rem] border bg-card px-6 py-5 text-sm text-muted-foreground">
          Checking your session...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/staff/login" replace state={{ from: location }} />;
  }

  if (!appUser) {
    return <Navigate to="/staff/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

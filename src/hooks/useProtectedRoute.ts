import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthContext } from "@/context/AuthContext";
import type { UserRole } from "@/types";

interface UseProtectedRouteOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function useProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
}: UseProtectedRouteOptions = {}) {
  const { user, loading, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate({ to: redirectTo });
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      navigate({ to: "/" });
    }
  }, [allowedRoles, loading, navigate, isAuthenticated, user]);

  return { loading, isAuthenticated, user };
}

import { useMemo } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { signIn, signUp, signOut, resetPassword } from "@/supabase/auth";
import type { SignUpMetadata } from "@/supabase/auth";

export function useAuth() {
  const { user, role, loading, session, isAuthenticated } = useAuthContext();

  return useMemo(
    () => ({
      user,
      role,
      session,
      loading,
      isAuthenticated,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }),
    [user, role, session, loading, isAuthenticated],
  );
}

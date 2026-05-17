import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { onAuthStateChange, getSession } from "@/supabase/auth";
import { getUserById } from "@/supabase/database";
import type { User as AppUser, UserRole } from "@/types";

interface AuthContextType {
  user: AppUser | null;
  role: UserRole | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const role = user?.role ?? null;

  const createFallbackUser = (sessionData: Session | null) => {
    if (!sessionData?.user?.id) return null;

    const metadata = sessionData.user.user_metadata as Record<string, unknown> | undefined;
    return {
      id: sessionData.user.id,
      role: (metadata?.role as UserRole) ?? "patient",
      full_name: (metadata?.full_name as string) ?? "",
      email: sessionData.user.email ?? "",
      phone: (metadata?.phone as string) ?? undefined,
      avatar_url: (metadata?.avatar_url as string) ?? undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as AppUser;
  };

  const loadUser = async (sessionData: Session | null) => {
    if (!sessionData?.user?.id) {
      setUser(null);
      return;
    }

    const { data, error } = await getUserById(sessionData.user.id);
    if (!error && data) {
      setUser(data);
    } else {
      setUser(createFallbackUser(sessionData));
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const { data } = await getSession();
      setSession(data.session);
      await loadUser(data.session);
      setLoading(false);
    };

    initialize();

    const subscription = onAuthStateChange(async (_, nextSession) => {
      setSession(nextSession);
      await loadUser(nextSession);
      setLoading(false);
    });

    return () => {
      try {
        // onAuthStateChange may return different shapes depending on @supabase/supabase-js version
        if (typeof subscription === "function") {
          // older style returns an unsubscribe function
          subscription();
        } else if (subscription?.data?.subscription?.unsubscribe) {
          subscription.data.subscription.unsubscribe();
        } else if (subscription?.unsubscribe) {
          subscription.unsubscribe();
        }
      } catch (e) {
        // swallow errors during cleanup
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      session,
      loading,
      isAuthenticated: Boolean(session?.user),
    }),
    [user, role, session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

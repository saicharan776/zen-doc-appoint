import { supabase } from "./client";
import type {
  AuthChangeEvent,
  Session,
  User as SupabaseUser,
  AuthError,
  Session as SupabaseSession,
} from "@supabase/supabase-js";
import type { UserRole } from "@/types";

export interface SignUpMetadata {
  role: UserRole;
  full_name: string;
  phone?: string;
  specialization?: string | null;
  registrationNumber?: string | null;
}

/**
 * Sign up a new user with a Supabase email/password account.
 */
export async function signUp(email: string, password: string, metadata: SignUpMetadata) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: metadata.role,
        full_name: metadata.full_name,
        phone: metadata.phone,
        specialization: metadata.specialization,
        registrationNumber: metadata.registrationNumber,
      },
    },
  });
  return { data, error };
}

/**
 * Sign in an existing user.
 */
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign out the current authenticated user.
 */
export async function signOut() {
  return supabase.auth.signOut();
}

/**
 * Send a password reset email to the user.
 */
export async function resetPassword(email: string, redirectTo?: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

/**
 * Get the currently authenticated auth session.
 */
export async function getSession() {
  return supabase.auth.getSession();
}

/**
 * Get the currently authenticated Supabase auth user.
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

/**
 * Subscribe to auth state changes for session persistence.
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return supabase.auth.onAuthStateChange(callback);
}

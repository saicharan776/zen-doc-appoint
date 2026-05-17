import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.",
  );
}

const isInvalidPlaceholder = (value: string | undefined) => {
  return !value || value.trim() === "" || value.includes("YOUR_SUPABASE_");
};

if (isInvalidPlaceholder(supabaseUrl) || isInvalidPlaceholder(supabaseAnonKey)) {
  throw new Error(
    "Invalid Supabase environment values detected. Replace placeholders in .env.local with your actual Supabase project URL and anon key.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});

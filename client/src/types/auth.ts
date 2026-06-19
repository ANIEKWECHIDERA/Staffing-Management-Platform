import type { Session } from "@supabase/supabase-js";

export type AppUserRole = "owner" | "staff";

export type AppUser = {
  id: string;
  supabaseUserId: string;
  email: string;
  fullName: string;
  role: AppUserRole;
  isActive: boolean;
};

export type AuthState = {
  session: Session | null;
  appUser: AppUser | null;
  isLoading: boolean;
  isRecoveryMode: boolean;
};

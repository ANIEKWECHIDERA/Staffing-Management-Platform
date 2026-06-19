/* eslint-disable react-refresh/only-export-components */
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { AppUser, AuthState } from "@/types/auth";

type AuthContextValue = AuthState & {
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateRecoveredPassword: (password: string) => Promise<void>;
  completeInvitePasswordSetup: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncAndLoadUser(session: Session) {
  await api.syncUser(session);
  const result = await api.me(session);
  return result.data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        setSession(initialSession);

        if (initialSession) {
          try {
            const user = await syncAndLoadUser(initialSession);
            if (isMounted) {
              setAppUser(user);
            }
          } catch {
            if (isMounted) {
              setAppUser(null);
            }
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);

      if (event === "SIGNED_OUT") {
        setAppUser(null);
        setIsRecoveryMode(false);
        setIsLoading(false);
        return;
      }

      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
      }

      if (!nextSession) {
        setAppUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      void syncAndLoadUser(nextSession)
        .then((user) => {
          setAppUser(user);
        })
        .catch(() => {
          setAppUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      appUser,
      isLoading,
      isRecoveryMode,
      async signInWithPassword(email: string, password: string) {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          throw error;
        }

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!currentSession) {
          setIsLoading(false);
          throw new Error("Unable to establish a session.");
        }

        try {
          const user = await syncAndLoadUser(currentSession);
          setSession(currentSession);
          setAppUser(user);
        } finally {
          setIsLoading(false);
        }
      },
      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
        setSession(null);
        setAppUser(null);
        setIsRecoveryMode(false);
      },
      async requestPasswordReset(email: string) {
        await api.forgotPassword(email);
      },
      async updateRecoveredPassword(password: string) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          throw error;
        }
        setIsRecoveryMode(false);
        toast.success("Password updated successfully.", {
          description: "You can now continue into the app or sign in again if needed.",
        });
      },
      async completeInvitePasswordSetup(password: string) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          throw error;
        }

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!currentSession) {
          throw new Error("Invite session could not be established.");
        }

        const user = await syncAndLoadUser(currentSession);
        setSession(currentSession);
        setAppUser(user);
        setIsRecoveryMode(false);
      },
    }),
    [appUser, isLoading, isRecoveryMode, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = { user: User | null; session: Session | null; loading: boolean; signOut: () => Promise<void> };

const Ctx = createContext<AuthCtx>({ user: null, session: null, loading: true, signOut: async () => {} });

async function ensureProfile(user: User) {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName =
    (meta.display_name as string) ||
    (meta.full_name as string) ||
    (meta.name as string) ||
    (user.email ? user.email.split("@")[0] : "User");
  const avatarUrl = (meta.avatar_url as string) || (meta.picture as string) || null;

  const { error } = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, display_name: displayName, avatar_url: avatarUrl },
      { onConflict: "id", ignoreDuplicates: false },
    );
  if (error) console.error("[auth] ensureProfile failed:", error);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // Set up listener BEFORE getSession to avoid missing events
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (!mounted) return;
      setSession(s);
      // Defer Supabase calls out of the auth callback to avoid deadlocks
      if (s?.user && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED")) {
        setTimeout(() => { ensureProfile(s.user).catch((e) => console.error(e)); }, 0);
      }
    });
    // Restore session from storage — this is the source of truth on first load
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
      if (data.session?.user) {
        setTimeout(() => { ensureProfile(data.session!.user).catch((e) => console.error(e)); }, 0);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signOut: async () => { await supabase.auth.signOut(); },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

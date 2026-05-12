import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });

function ResetPassword() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated.");
    nav({ to: "/home" });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-mesh px-5">
      <div className="w-full max-w-md rounded-3xl glass card-glow p-6">
        <h1 className="mb-2 text-center text-2xl font-black tracking-tight text-foreground">Set new password</h1>
        <p className="mb-5 text-center text-xs text-muted-foreground">Choose something you'll remember.</p>
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              required
              minLength={6}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              className="h-12 w-full rounded-xl bg-input pl-10 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-neon-orange"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-cr text-sm font-extrabold uppercase tracking-widest text-background shadow-orange disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}
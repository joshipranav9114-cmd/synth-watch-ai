import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password: pw,
          options: { emailRedirectTo: window.location.origin + "/home" },
        });
        if (error) throw error;
        toast.success("Account created — entering the universe...");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      }
      nav({ to: "/home" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center bg-background px-5 pb-10 pt-12">
      <div className="absolute inset-x-0 top-0 h-72 opacity-70" style={{
        background: "radial-gradient(60% 80% at 50% 0%, oklch(0.78 0.20 350 / 0.45), transparent 70%)",
      }} />
      <header className="relative mb-6 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gradient-neon">AniVerse</h1>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full glass px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground">
          <Sparkles className="h-3 w-3 text-neon-pink" /> AI Personalized
        </div>
      </header>

      <div className="relative w-full max-w-md rounded-3xl glass p-6 shadow-card">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
          {mode === "signin" ? "Welcome Back" : "Initialize Account"}
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Neural ID (Email)</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="kusanagi@sector9.com"
                className="h-12 w-full rounded-xl bg-input pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cipher Key</label>
              <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-neon-pink">Forgot?</button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={show ? "text" : "password"} required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded-xl bg-input pl-10 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="h-13 flex h-13 w-full items-center justify-center rounded-full bg-gradient-hero py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-neon disabled:opacity-60"
          >
            {loading ? "..." : mode === "signin" ? "Enter the Universe" : "Initialize Account"}
          </button>
        </form>
      </div>

      <p className="relative mt-8 text-sm text-muted-foreground">
        {mode === "signin" ? "New to the Sector?" : "Already a Pilot?"}{" "}
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-bold text-neon-pink">
          {mode === "signin" ? "Initialize Account" : "Sign In"}
        </button>
      </p>

      <footer className="relative mt-auto pt-10 text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Version 2.0.4 // System Stable</p>
        <Link to="/" className="mt-3 inline-block text-[10px] uppercase tracking-widest text-muted-foreground/60">Back to splash</Link>
      </footer>
    </main>
  );
}

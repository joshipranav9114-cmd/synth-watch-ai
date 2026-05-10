import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import logo from "@/assets/aniverse-logo.png";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({ component: Splash });

function Splash() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => nav({ to: user ? "/home" : "/onboarding" }), 1400);
    return () => clearTimeout(t);
  }, [loading, user, nav]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.78 0.18 220 / 0.18) 1px, transparent 0)", backgroundSize: "22px 22px" }} />
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex flex-col items-center">
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl glass animate-pulse-neon">
          <img src={logo} alt="AniVerse" className="h-16 w-16 animate-float" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gradient-neon">AniVerse</h1>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-neon px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-neon">
          ✦ AI Personalized
        </div>
      </div>
      <div className="absolute bottom-16 flex flex-col items-center gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Powered by AI</p>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 rounded-full bg-gradient-hero animate-pulse" />
        </div>
      </div>
    </main>
  );
}

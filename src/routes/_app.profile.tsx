import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings, Shield, Palette, Award } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app/profile")({ component: Profile });

function Profile() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const name = user?.email?.split("@")[0] ?? "Pilot";

  const items = [
    { icon: Settings, label: "Account Settings" },
    { icon: Palette, label: "Interface Theme" },
    { icon: Shield, label: "Privacy & Security" },
  ];

  return (
    <main className="px-5 pt-10">
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32 rounded-full bg-gradient-hero p-1 shadow-neon animate-pulse-neon">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-4xl font-bold capitalize text-gradient-neon">
            {name[0]}
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground">PRO</div>
        </div>
        <h2 className="mt-5 text-2xl font-bold capitalize text-foreground">{name}</h2>
        <span className="mt-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-neon-pink">Anime Soul: Seinen Expert</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Anime Watched" value="248" color="text-neon-cyan" />
        <Stat label="Episodes" value="5,102" color="text-neon-pink" />
      </div>

      <div className="mt-6 rounded-3xl glass p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Achievements</h3>
          <span className="rounded-md bg-primary/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-neon-pink">AI Analyzed</span>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {["Seasonal", "Binge", "Top Reviewer", "Hidden"].map((t, i) => (
            <div key={t} className={`flex w-24 flex-shrink-0 flex-col items-center gap-2 rounded-2xl border border-border p-3 ${i === 0 ? "shadow-cyan" : ""}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Award className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2 rounded-3xl glass p-2">
        {items.map(({ icon: Icon, label }) => (
          <button key={label} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-muted/50">
            <Icon className="h-5 w-5 text-neon-cyan" />
            <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
            <span className="text-muted-foreground">›</span>
          </button>
        ))}
        <button onClick={async () => { await signOut(); nav({ to: "/login" }); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-muted/50">
          <LogOut className="h-5 w-5 text-destructive" />
          <span className="flex-1 text-sm font-semibold text-destructive">Logout</span>
        </button>
      </div>
    </main>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl glass p-4 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

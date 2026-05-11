import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Sparkles } from "lucide-react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { AnimeCard } from "@/components/AnimeCard";
import { useFeaturedAnime, useSeasonalAnime, useTopAnime, type Anime } from "@/lib/anime-data";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import logo from "@/assets/aniverse-logo.png";

export const Route = createFileRoute("/_app/home")({ component: Home });

function Home() {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "Pilot";
  const { data: featured } = useFeaturedAnime();
  const { data: trending } = useTopAnime();
  const { data: seasonal } = useSeasonalAnime();

  return (
    <main>
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="h-7 w-7" />
          <span className="text-lg font-extrabold text-gradient-neon">AniVerse</span>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full glass">
          <Bell className="h-4 w-4 text-foreground" />
        </button>
      </header>

      <HeroCarousel />

      <section className="px-5 pt-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Welcome back</p>
        <h2 className="text-2xl font-bold capitalize text-foreground">{name}, your timeline awaits</h2>
      </section>

      <Section title="For You" subtitle="AI Curated">
        <CardRow items={featured} />
      </Section>

      <Section title="Trending Now" subtitle="This week">
        <CardRow items={trending} size="lg" />
      </Section>

      <Section title="This Season" subtitle="Spring 2025">
        <CardRow items={seasonal} />
      </Section>

      <section className="px-5 pt-6">
        <Link to="/assistant" className="flex items-center gap-3 rounded-3xl glass p-4 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-hero shadow-neon">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Ask Ani — your AI assistant</p>
            <p className="text-xs text-muted-foreground">"Find me something emotional tonight..."</p>
          </div>
        </Link>
      </section>
    </main>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="pt-6">
      <div className="mb-3 flex items-end justify-between px-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan">{subtitle}</p>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>
        <button className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">View all</button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">{children}</div>
    </section>
  );
}

function CardRow({ items, size = "md" }: { items: Anime[] | undefined; size?: "sm" | "md" | "lg" }) {
  if (!items || items.length === 0) {
    const w = size === "lg" ? "w-44 h-60" : "w-36 h-52";
    return (
      <>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className={`flex-shrink-0 rounded-2xl ${w}`} />
        ))}
      </>
    );
  }
  return (
    <>
      {items.map((a) => <AnimeCard key={a.id} anime={a} size={size} />)}
    </>
  );
}

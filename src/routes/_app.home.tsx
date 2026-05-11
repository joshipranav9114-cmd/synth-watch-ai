import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Flame, Search, Sparkles, TrendingUp } from "lucide-react";
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
    <main className="bg-mesh">
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="h-8 w-8 drop-shadow-[0_0_12px_rgba(180,80,255,0.7)]" />
          <span className="text-xl font-black tracking-tight text-gradient-neon">AniVerse</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/search" className="flex h-9 w-9 items-center justify-center rounded-full glass">
            <Search className="h-4 w-4 text-foreground" />
          </Link>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full glass">
            <Bell className="h-4 w-4 text-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-orange shadow-orange" />
          </button>
        </div>
      </header>

      <HeroCarousel />

      <section className="px-5 pt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neon-orange">Welcome back</p>
        <h2 className="mt-1 text-2xl font-black capitalize tracking-tight text-foreground">
          {name}, ready for <span className="text-gradient-neon">today's drop?</span>
        </h2>
      </section>

      <section className="px-5 pt-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Subbed", count: "12K+", grad: "bg-gradient-orange" },
            { label: "Dubbed", count: "5.2K", grad: "bg-gradient-neon" },
            { label: "Movies", count: "1.8K", grad: "bg-gradient-blue" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl glass p-3 text-center card-glow">
              <p className={`bg-clip-text text-lg font-black text-transparent ${s.grad}`}>{s.count}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section title="For You" subtitle="AI Curated" icon={<Sparkles className="h-3 w-3" />} accent="text-neon-pink">
        <CardRow items={featured} size="lg" />
      </Section>

      <Section title="Top 10 This Week" subtitle="Trending" icon={<TrendingUp className="h-3 w-3" />} accent="text-neon-orange">
        <CardRow items={trending?.slice(0, 10)} size="xl" ranked />
      </Section>

      <Section title="New Episodes" subtitle="This Season" icon={<Flame className="h-3 w-3" />} accent="text-neon-cyan">
        <CardRow items={seasonal} size="lg" />
      </Section>

      <section className="px-5 pt-8">
        <Link
          to="/assistant"
          className="relative block overflow-hidden rounded-3xl bg-gradient-hero p-5 shadow-neon"
        >
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-neon-orange/40 blur-3xl" />
          <div className="absolute -bottom-8 -left-4 h-32 w-32 rounded-full bg-neon-blue/40 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/30 backdrop-blur-md">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/80">
                AI Assistant
              </p>
              <p className="text-base font-extrabold text-primary-foreground">Ask Ani anything</p>
              <p className="mt-0.5 text-xs text-primary-foreground/80">"Find me something emotional tonight…"</p>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}

function Section({
  title,
  subtitle,
  icon,
  accent = "text-neon-cyan",
  children,
}: {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-7">
      <div className="mb-3 flex items-end justify-between px-5">
        <div>
          <p className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.25em] ${accent}`}>
            {icon} {subtitle}
          </p>
          <h3 className="text-2xl font-black tracking-tight text-foreground">{title}</h3>
        </div>
        <button className="rounded-full glass px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
          View all
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto px-5 pb-3 scrollbar-hide">{children}</div>
    </section>
  );
}

function CardRow({
  items,
  size = "md",
  ranked = false,
}: {
  items: Anime[] | undefined;
  size?: "sm" | "md" | "lg" | "xl";
  ranked?: boolean;
}) {
  if (!items || items.length === 0) {
    const w =
      size === "xl" ? "w-52 h-72" : size === "lg" ? "w-44 h-64" : "w-36 h-52";
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
      {items.map((a, idx) => (
        <AnimeCard key={a.id} anime={a} size={size} rank={ranked ? idx + 1 : undefined} />
      ))}
    </>
  );
}

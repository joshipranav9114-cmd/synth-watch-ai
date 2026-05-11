import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useFeaturedAnime } from "@/lib/anime-data";
import { Play, Plus, Sparkles, Star } from "lucide-react";

export function HeroCarousel() {
  const [i, setI] = useState(0);
  const { data: ANIME, isLoading } = useFeaturedAnime();
  useEffect(() => {
    if (!ANIME.length) return;
    const t = setInterval(() => setI((p) => (p + 1) % ANIME.length), 5000);
    return () => clearInterval(t);
  }, [ANIME.length]);
  if (isLoading || !ANIME.length) {
    return <div className="h-[560px] w-full animate-pulse bg-muted/20" />;
  }
  const a = ANIME[i];
  return (
    <div className="relative block h-[560px] w-full overflow-hidden">
      <img
        key={a.id}
        src={a.image}
        alt={a.title}
        className="h-full w-full animate-[fade-in_0.8s_ease-out] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />

      <div className="absolute right-4 top-20 z-10 rounded-full bg-gradient-orange px-3 py-1 text-[10px] font-black uppercase tracking-widest text-background shadow-orange">
        #{i + 1} Spotlight
      </div>

      <div className="absolute bottom-8 left-5 right-5">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neon-pink">
          <Sparkles className="h-3 w-3" /> AI Pick · {a.match}% match
        </div>
        <h2 className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          {a.title}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1 rounded-md bg-gradient-orange px-1.5 py-0.5 text-background">
            <Star className="h-3 w-3 fill-current" /> {a.rating?.toFixed(1)}
          </span>
          <span className="rounded-md glass px-1.5 py-0.5 text-neon-cyan">HD</span>
          <span className="rounded-md glass px-1.5 py-0.5 text-foreground">{a.year}</span>
          <span className="text-muted-foreground">{a.genres.slice(0, 3).join(" • ")}</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Link
            to="/anime/$id"
            params={{ id: a.id }}
            className="flex h-12 items-center gap-2 rounded-full bg-gradient-hero px-6 text-sm font-extrabold uppercase tracking-widest text-primary-foreground shadow-neon"
          >
            <Play className="h-4 w-4 fill-current" /> Watch Now
          </Link>
          <Link
            to="/anime/$id"
            params={{ id: a.id }}
            className="flex h-12 items-center gap-2 rounded-full glass px-5 text-sm font-bold text-foreground"
          >
            <Plus className="h-4 w-4" /> My List
          </Link>
        </div>

        <div className="mt-5 flex gap-2">
          {ANIME.map((_a, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-10 bg-gradient-orange" : "w-3 bg-muted/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

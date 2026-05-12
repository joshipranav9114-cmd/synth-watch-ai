import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useFeaturedAnime } from "@/lib/anime-data";
import { Play, Plus, Sparkles, Star, Info } from "lucide-react";

export function HeroCarousel() {
  const [i, setI] = useState(0);
  const { data: ANIME, isLoading } = useFeaturedAnime();
  useEffect(() => {
    if (!ANIME.length) return;
    const t = setInterval(() => setI((p) => (p + 1) % ANIME.length), 5000);
    return () => clearInterval(t);
  }, [ANIME.length]);
  if (isLoading || !ANIME.length) {
    return <div className="h-[640px] w-full animate-pulse bg-muted/20" />;
  }
  const a = ANIME[i];
  return (
    <div className="relative block h-[640px] w-full overflow-hidden">
      <img
        key={a.id}
        src={a.image}
        alt={a.title}
        className="h-full w-full animate-[fade-in_0.8s_ease-out] object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="pointer-events-none absolute -left-2 top-24 select-none font-black leading-none text-stroke-orange" style={{ fontSize: "9rem" }}>
        {i + 1}
      </div>

      <div className="absolute right-4 top-20 z-10 flex items-center gap-1 rounded-full bg-gradient-cr px-3 py-1 text-[10px] font-black uppercase tracking-widest text-background shadow-orange">
        <Sparkles className="h-3 w-3" /> #{i + 1} Spotlight
      </div>

      <div className="absolute bottom-10 left-5 right-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-gradient-cr px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-background shadow-orange">
            CR Originals
          </span>
          <span className="inline-flex items-center gap-1 rounded-full glass px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neon-pink">
            <Sparkles className="h-3 w-3" /> {a.match}% match
          </span>
        </div>
        <h2 className="text-balance text-5xl font-black leading-[0.95] tracking-tight text-foreground drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
          {a.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1 rounded-md bg-gradient-cr px-1.5 py-0.5 text-background">
            <Star className="h-3 w-3 fill-current" /> {a.rating?.toFixed(1)}
          </span>
          <span className="rounded-md glass px-1.5 py-0.5 text-neon-orange">SUB | DUB</span>
          <span className="rounded-md glass px-1.5 py-0.5 text-neon-cyan">4K HDR</span>
          <span className="rounded-md glass px-1.5 py-0.5 text-foreground">{a.year}</span>
        </div>
        <p className="mt-3 line-clamp-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {a.synopsis}
        </p>
        <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {a.genres.slice(0, 3).join(" • ")}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Link
            to="/anime/$id"
            params={{ id: a.id }}
            className="flex h-12 items-center gap-2 rounded-full bg-gradient-cr px-7 text-sm font-extrabold uppercase tracking-widest text-background shadow-orange"
          >
            <Play className="h-4 w-4 fill-current" /> Watch Now
          </Link>
          <Link
            to="/anime/$id"
            params={{ id: a.id }}
            className="flex h-12 w-12 items-center justify-center rounded-full glass text-foreground"
            aria-label="Add to list"
          >
            <Plus className="h-5 w-5" />
          </Link>
          <Link
            to="/anime/$id"
            params={{ id: a.id }}
            className="flex h-12 w-12 items-center justify-center rounded-full glass text-foreground"
            aria-label="More info"
          >
            <Info className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-5 flex gap-2">
          {ANIME.map((_a, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-10 bg-gradient-cr shadow-orange" : "w-3 bg-muted/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

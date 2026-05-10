import { Link } from "@tanstack/react-router";
import type { Anime } from "@/lib/anime-data";
import { Star } from "lucide-react";

export function AnimeCard({ anime, size = "md" }: { anime: Anime; size?: "sm" | "md" | "lg" }) {
  const w = size === "lg" ? "w-44" : size === "sm" ? "w-28" : "w-36";
  const h = size === "lg" ? "h-60" : size === "sm" ? "h-40" : "h-52";
  return (
    <Link to="/anime/$id" params={{ id: anime.id }} className={`group flex-shrink-0 ${w}`}>
      <div className={`relative ${h} overflow-hidden rounded-2xl shadow-card`}>
        <img
          src={anime.image}
          alt={anime.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute left-2 top-2 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-bold text-neon-cyan backdrop-blur-md">
          {anime.match}% MATCH
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-1 text-[10px] text-neon-cyan">
            <Star className="h-3 w-3 fill-current" />
            {anime.rating}
          </div>
        </div>
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-semibold text-foreground">{anime.title}</p>
      <p className="line-clamp-1 text-[11px] uppercase tracking-wider text-muted-foreground">{anime.genres[0]}</p>
    </Link>
  );
}

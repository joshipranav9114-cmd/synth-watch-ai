import { Link } from "@tanstack/react-router";
import type { Anime } from "@/lib/anime-data";
import { Play, Star } from "lucide-react";

export function AnimeCard({
  anime,
  size = "md",
  rank,
}: {
  anime: Anime;
  size?: "sm" | "md" | "lg" | "xl";
  rank?: number;
}) {
  const w =
    size === "xl" ? "w-52" : size === "lg" ? "w-44" : size === "sm" ? "w-28" : "w-36";
  const h =
    size === "xl" ? "h-72" : size === "lg" ? "h-64" : size === "sm" ? "h-40" : "h-52";
  return (
    <Link to="/anime/$id" params={{ id: anime.id }} className={`group flex-shrink-0 ${w}`}>
      <div className={`relative ${h} overflow-hidden rounded-2xl card-glow`}>
        <img
          src={anime.image}
          alt={anime.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-gradient-orange px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-background shadow-orange">
          <Star className="h-2.5 w-2.5 fill-current" /> {anime.rating?.toFixed(1)}
        </div>
        {anime.episodes ? (
          <div className="absolute right-2 top-2 rounded-md bg-background/75 px-1.5 py-0.5 text-[10px] font-bold text-neon-cyan backdrop-blur-md">
            EP {anime.episodes}
          </div>
        ) : null}
        {rank ? (
          <div className="pointer-events-none absolute -bottom-3 -left-1 select-none font-black leading-none text-stroke-neon" style={{ fontSize: size === "xl" ? "5.5rem" : "4.5rem" }}>
            {rank}
          </div>
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-hero shadow-neon">
            <Play className="h-5 w-5 fill-current text-primary-foreground" />
          </div>
        </div>
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-bold tracking-tight text-foreground">{anime.title}</p>
      <p className="line-clamp-1 text-[11px] font-medium uppercase tracking-wider text-neon-orange/90">
        {anime.genres[0] ?? "Anime"} {anime.year ? `· ${anime.year}` : ""}
      </p>
    </Link>
  );
}

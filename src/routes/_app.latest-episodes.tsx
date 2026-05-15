import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Flame, Play } from "lucide-react";
import { useSeasonalAnime, type Anime } from "@/lib/anime-data";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/latest-episodes")({ component: LatestEpisodesPage });

function LatestEpisodesPage() {
  const { data: seasonal, isLoading } = useSeasonalAnime();

  return (
    <main className="min-h-screen px-5 pt-6 page-enter">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/home" className="flex h-10 w-10 items-center justify-center rounded-full glass press">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </Link>
        <div>
          <p className="heading-eyebrow text-neon-pink flex items-center gap-1">
            <Flame className="h-3 w-3" /> Fresh Drops
          </p>
          <h1 className="heading-1 text-foreground">Latest Episodes</h1>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && seasonal && (
        <div className="grid grid-cols-2 gap-4 pb-24">
          {seasonal.map((a, i) => {
            const ep = (i % 24) + 1;
            return (
              <EpisodeCard key={a.id} anime={a} episode={ep} index={i} />
            );
          })}
        </div>
      )}
    </main>
  );
}

function EpisodeCard({ anime, episode, index }: { anime: Anime; episode: number; index: number }) {
  return (
    <Link
      to="/anime/$id"
      params={{ id: anime.id }}
      className="group w-full animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative h-36 overflow-hidden rounded-2xl card-glow card-interactive">
        <img src={anime.image} alt={anime.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
        <div className="absolute left-2 top-2 rounded-md bg-gradient-cr px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-background shadow-orange">
          NEW
        </div>
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-bold text-foreground backdrop-blur-md">
          <Clock className="h-2.5 w-2.5" /> 24m
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-cr shadow-orange">
            <Play className="h-5 w-5 fill-current text-background" />
          </div>
        </div>
      </div>
      <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-neon-orange">Episode {episode}</p>
      <p className="line-clamp-1 text-sm font-bold tracking-tight text-foreground">{anime.title}</p>
    </Link>
  );
}

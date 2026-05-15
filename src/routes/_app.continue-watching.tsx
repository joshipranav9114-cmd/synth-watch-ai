import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, Zap } from "lucide-react";
import { useFeaturedAnime, type Anime } from "@/lib/anime-data";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/continue-watching")({ component: ContinueWatchingPage });

function ContinueWatchingPage() {
  const { data: featured, isLoading } = useFeaturedAnime();

  return (
    <main className="min-h-screen px-5 pt-6 page-enter">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/home" className="flex h-10 w-10 items-center justify-center rounded-full glass press">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </Link>
        <div>
          <p className="heading-eyebrow text-neon-orange flex items-center gap-1">
            <Zap className="h-3 w-3" /> Pick up where you left off
          </p>
          <h1 className="heading-1 text-foreground">Continue Watching</h1>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && featured && (
        <div className="grid grid-cols-1 gap-4 pb-24">
          {featured.map((a, i) => {
            const ep = (i % 12) + 1;
            const progress = 25 + ((i * 17) % 65);
            return (
              <ContinueCard key={a.id} anime={a} episode={ep} progress={progress} index={i} />
            );
          })}
        </div>
      )}
    </main>
  );
}

function ContinueCard({ anime, episode, progress, index }: { anime: Anime; episode: number; progress: number; index: number }) {
  return (
    <Link
      to="/anime/$id"
      params={{ id: anime.id }}
      className="group relative h-40 w-full overflow-hidden rounded-2xl card-glow card-interactive animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <img src={anime.image} alt={anime.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute right-3 top-3 rounded-md bg-background/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-orange backdrop-blur-md">
        EP {episode}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-cr shadow-orange transition-transform duration-300 group-hover:scale-110 animate-glow">
          <Play className="h-5 w-5 fill-current text-background" />
        </div>
      </div>
      <div className="absolute inset-x-3 bottom-3">
        <p className="line-clamp-1 text-sm font-extrabold tracking-tight text-foreground">{anime.title}</p>
        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {Math.round((progress / 100) * 24)}m left
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background/60">
          <div className="h-full bg-gradient-cr" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Link>
  );
}

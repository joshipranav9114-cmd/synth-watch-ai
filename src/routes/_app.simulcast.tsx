import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Flame } from "lucide-react";
import { useSeasonalAnime, type Anime } from "@/lib/anime-data";
import { AnimeCard } from "@/components/AnimeCard";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/simulcast")({ component: SimulcastPage });

function SimulcastPage() {
  const { data: seasonal, isLoading } = useSeasonalAnime();

  return (
    <main className="min-h-screen px-5 pt-6 page-enter">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/home" className="flex h-10 w-10 items-center justify-center rounded-full glass press">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </Link>
        <div>
          <p className="heading-eyebrow text-neon-cyan flex items-center gap-1">
            <Flame className="h-3 w-3" /> This Season
          </p>
          <h1 className="heading-1 text-foreground">Simulcast Season</h1>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && seasonal && (
        <div className="grid grid-cols-2 gap-4 pb-24">
          {seasonal.map((a, i) => (
            <div key={a.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
              <AnimeCard anime={a} size="xl" />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchAnime } from "@/lib/anime-data";
import { AnimeCard } from "@/components/AnimeCard";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/search")({ component: Search });

const GENRES = ["All", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", "Sci-Fi", "Slice of Life", "Supernatural", "Mecha"];

function Search() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");
  const { data: results, isLoading } = useSearchAnime(q, genre);

  return (
    <main className="bg-mesh px-5 pt-6 min-h-screen">
      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-neon-orange">Explore</p>
      <h1 className="heading-1 text-foreground">
        Discover <span className="text-gradient-neon">Anime</span>
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">Search 4,200+ timelines, studios & characters</p>

      <div className="relative mt-5">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search anime, studios, characters..."
          className="h-13 w-full rounded-2xl glass pl-11 pr-4 py-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 scrollbar-hide smooth-scroll">
        {GENRES.map((g) => (
          <button
            key={g} onClick={() => setGenre(g)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              genre === g ? "bg-gradient-hero text-primary-foreground shadow-neon" : "glass text-muted-foreground"
            }`}
          >{g}</button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
        ))}
        {!isLoading && results?.map((a) => (
          <div key={a.id}><AnimeCard anime={a} size="lg" /></div>
        ))}
        {!isLoading && results && results.length === 0 && (
          <p className="col-span-2 mt-10 text-center text-sm text-muted-foreground">No timelines match your query.</p>
        )}
      </div>
    </main>
  );
}

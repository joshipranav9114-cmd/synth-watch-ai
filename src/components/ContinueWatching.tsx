import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import type { Anime } from "@/lib/anime-data";
import { Skeleton } from "@/components/ui/skeleton";

export function ContinueWatching({ items }: { items: Anime[] | undefined }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex gap-4 overflow-x-auto px-5 pb-3 scrollbar-hide smooth-scroll">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-72 flex-shrink-0 rounded-2xl" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-4 overflow-x-auto px-5 pb-3 scrollbar-hide snap-x-mandatory smooth-scroll">
      {items.map((a, i) => {
        const ep = (i % 12) + 1;
        const progress = 25 + ((i * 17) % 65);
        return (
          <Link
            key={a.id}
            to="/anime/$id"
            params={{ id: a.id }}
            className="group relative h-40 w-72 flex-shrink-0 snap-start overflow-hidden rounded-2xl card-glow card-interactive animate-fade-up"
            style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
          >
            <img src={a.image} alt={a.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute right-3 top-3 rounded-md bg-background/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-orange backdrop-blur-md">
              EP {ep}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-cr shadow-orange transition-transform duration-300 group-hover:scale-110 animate-glow">
                <Play className="h-5 w-5 fill-current text-background" />
              </div>
            </div>
            <div className="absolute inset-x-3 bottom-3">
              <p className="line-clamp-1 text-sm font-extrabold tracking-tight text-foreground">{a.title}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {Math.round((progress / 100) * 24)}m left
              </p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background/60">
                <div className="h-full bg-gradient-cr" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
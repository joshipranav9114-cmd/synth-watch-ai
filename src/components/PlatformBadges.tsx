import type { Anime } from "@/lib/anime-data";
import { getStreamingFor, type Platform } from "@/lib/streaming";
import { ExternalLink } from "lucide-react";

export function PlatformChips({ anime, size = "sm" }: { anime: Anime; size?: "xs" | "sm" }) {
  const platforms = getStreamingFor(anime);
  const dims = size === "xs" ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px]";
  return (
    <div className="flex items-center gap-1">
      {platforms.slice(0, 3).map((p) => (
        <span
          key={p.id}
          title={p.name}
          className={`${dims} ${p.color} ${p.text} flex items-center justify-center rounded-md font-black tracking-tight shadow-sm ring-1 ring-background/40`}
        >
          {p.short}
        </span>
      ))}
    </div>
  );
}

export function PlatformList({ anime }: { anime: Anime }) {
  const platforms = getStreamingFor(anime);
  return (
    <div className="flex flex-col gap-2">
      {platforms.map((p: Platform) => (
        <a
          key={p.id}
          href={p.searchUrl(anime.title)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-2xl glass p-3 transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${p.color} ${p.text} text-sm font-black shadow-md`}>
              {p.short}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{p.name}</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Stream Now · SUB | DUB
              </p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-neon-orange" />
        </a>
      ))}
    </div>
  );
}
import type { Anime } from "@/lib/anime-data";
import { getStreamingFor, type Platform } from "@/lib/streaming";
import { ExternalLink, Play } from "lucide-react";

export function PlatformChips({ anime, size = "sm" }: { anime: Anime; size?: "xs" | "sm" }) {
  const platforms = getStreamingFor(anime);
  const dims = size === "xs" ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px]";
  const logo = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-1">
      {platforms.slice(0, 4).map((p) => {
        const Logo = p.Logo;
        return (
          <span
            key={p.id}
            title={p.name}
            style={{ background: p.gradient }}
            className={`${dims} flex items-center justify-center rounded-md shadow-sm ring-1 ring-background/40 ${p.onBrand === "white" ? "text-white" : "text-black"}`}
          >
            <Logo className={logo} />
          </span>
        );
      })}
    </div>
  );
}

export function PlatformList({ anime }: { anime: Anime }) {
  const platforms = getStreamingFor(anime);
  if (platforms.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">Streaming info unavailable for this title.</p>
    );
  }
  return (
    <div className="flex flex-col gap-2.5">
      {platforms.map((p: Platform) => <PlatformRow key={p.id} platform={p} title={anime.title} />)}
    </div>
  );
}

function PlatformRow({ platform: p, title }: { platform: Platform; title: string }) {
  const Logo = p.Logo;
  return (
    <a
      href={p.searchUrl(title)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${title} on ${p.name}`}
      style={{
        // platform-tinted ring + hover glow
        ["--brand" as never]: p.brand,
      }}
      className="group relative flex min-h-[64px] items-center gap-3 overflow-hidden rounded-2xl glass p-3 ring-1 ring-[color:var(--brand)]/20 transition-all duration-300 hover:scale-[1.015] hover:ring-[color:var(--brand)]/60 active:scale-[0.99]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(120% 80% at 0% 50%, ${p.brand}22, transparent 60%)` }}
      />
      <div
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-md ${p.onBrand === "white" ? "text-white" : "text-black"}`}
        style={{ background: p.gradient, boxShadow: `0 6px 18px -6px ${p.brand}99` }}
      >
        <Logo className="h-5 w-5" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">{p.name}</p>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Stream now · SUB | DUB
        </p>
      </div>
      <span
        className={`relative hidden h-9 items-center gap-1.5 rounded-full px-3.5 text-[11px] font-black uppercase tracking-widest shadow-sm transition-transform group-hover:scale-105 group-active:scale-95 sm:flex ${p.onBrand === "white" ? "text-white" : "text-black"}`}
        style={{ background: p.gradient }}
      >
        <Play className="h-3 w-3 fill-current" />
        Watch Now
      </span>
      <span
        aria-label="Open external link"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors group-hover:text-[color:var(--brand)] sm:hidden"
        style={{ background: `${p.brand}1a` }}
      >
        <ExternalLink className="h-4 w-4" />
      </span>
    </a>
  );
}
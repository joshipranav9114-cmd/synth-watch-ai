import type { Anime } from "@/lib/anime-data";

export type Platform = {
  id: string;
  name: string;
  short: string;
  color: string; // tailwind bg
  text: string; // tailwind text
  searchUrl: (title: string) => string;
};

export const PLATFORMS: Record<string, Platform> = {
  crunchyroll: {
    id: "crunchyroll",
    name: "Crunchyroll",
    short: "CR",
    color: "bg-[#F47521]",
    text: "text-white",
    searchUrl: (t) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(t)}`,
  },
  netflix: {
    id: "netflix",
    name: "Netflix",
    short: "N",
    color: "bg-[#E50914]",
    text: "text-white",
    searchUrl: (t) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}`,
  },
  prime: {
    id: "prime",
    name: "Prime Video",
    short: "PV",
    color: "bg-[#00A8E1]",
    text: "text-white",
    searchUrl: (t) => `https://www.primevideo.com/search/?phrase=${encodeURIComponent(t)}`,
  },
  hotstar: {
    id: "hotstar",
    name: "Disney+ Hotstar",
    short: "D+",
    color: "bg-[#1F80E0]",
    text: "text-white",
    searchUrl: (t) => `https://www.hotstar.com/in/search?q=${encodeURIComponent(t)}`,
  },
  hidive: {
    id: "hidive",
    name: "Hidive",
    short: "HD",
    color: "bg-[#00BCD4]",
    text: "text-white",
    searchUrl: (t) => `https://www.hidive.com/search?q=${encodeURIComponent(t)}`,
  },
};

// Curated mapping for popular series, plus deterministic fallback.
const KNOWN: Record<string, string[]> = {
  "21": ["crunchyroll", "netflix"], // One Piece
  "16498": ["crunchyroll", "netflix", "hotstar"], // AoT
  "38000": ["crunchyroll", "netflix", "hotstar"], // Demon Slayer
  "31240": ["crunchyroll"], // Re:Zero
  "11061": ["netflix", "crunchyroll"], // HxH
  "32281": ["prime", "netflix"], // Your Name
  "918": ["crunchyroll", "hidive"], // Gintama
};

export function getStreamingFor(anime: Pick<Anime, "id" | "malId">): Platform[] {
  const ids = KNOWN[anime.id];
  if (ids) return ids.map((k) => PLATFORMS[k]).filter(Boolean);
  // deterministic fallback based on malId
  const all = Object.values(PLATFORMS);
  const seed = (anime.malId || 1) % all.length;
  const count = ((anime.malId || 1) % 2) + 1; // 1-2 platforms
  return Array.from({ length: count }, (_, i) => all[(seed + i) % all.length]);
}

export function primaryPlatform(anime: Pick<Anime, "id" | "malId">): Platform {
  return getStreamingFor(anime)[0] ?? PLATFORMS.crunchyroll;
}
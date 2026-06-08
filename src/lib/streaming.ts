import type { Anime } from "@/lib/anime-data";
import type { ComponentType, SVGProps } from "react";
import {
  AppleTVLogo,
  CrunchyrollLogo,
  DisneyPlusLogo,
  HidiveLogo,
  HuluLogo,
  MaxLogo,
  NetflixLogo,
  PrimeVideoLogo,
  YouTubeLogo,
} from "@/components/PlatformLogos";

export type Platform = {
  id: string;
  name: string;
  short: string;
  color: string; // tailwind bg utility (back-compat for chips)
  text: string; // tailwind text utility (back-compat for chips)
  brand: string; // hex brand color
  gradient: string; // CSS linear-gradient
  onBrand: "white" | "black"; // contrast for logo on brand tile
  Logo: ComponentType<SVGProps<SVGSVGElement>>;
  searchUrl: (title: string) => string;
};

export const PLATFORMS: Record<string, Platform> = {
  crunchyroll: {
    id: "crunchyroll",
    name: "Crunchyroll",
    short: "CR",
    color: "bg-[#F47521]",
    text: "text-white",
    brand: "#F47521",
    gradient: "linear-gradient(135deg, #F47521 0%, #FF9A3C 100%)",
    onBrand: "white",
    Logo: CrunchyrollLogo,
    searchUrl: (t) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(t)}`,
  },
  netflix: {
    id: "netflix",
    name: "Netflix",
    short: "N",
    color: "bg-[#E50914]",
    text: "text-white",
    brand: "#E50914",
    gradient: "linear-gradient(135deg, #B0060F 0%, #E50914 100%)",
    onBrand: "white",
    Logo: NetflixLogo,
    searchUrl: (t) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}`,
  },
  prime: {
    id: "prime",
    name: "Prime Video",
    short: "PV",
    color: "bg-[#00A8E1]",
    text: "text-white",
    brand: "#00A8E1",
    gradient: "linear-gradient(135deg, #0073B1 0%, #00A8E1 100%)",
    onBrand: "white",
    Logo: PrimeVideoLogo,
    searchUrl: (t) => `https://www.primevideo.com/search/?phrase=${encodeURIComponent(t)}`,
  },
  disneyplus: {
    id: "disneyplus",
    name: "Disney+",
    short: "D+",
    color: "bg-[#1F80E0]",
    text: "text-white",
    brand: "#1F80E0",
    gradient: "linear-gradient(135deg, #0E2A6B 0%, #1F80E0 100%)",
    onBrand: "white",
    Logo: DisneyPlusLogo,
    searchUrl: (t) => `https://www.disneyplus.com/search?q=${encodeURIComponent(t)}`,
  },
  hidive: {
    id: "hidive",
    name: "Hidive",
    short: "HD",
    color: "bg-[#00BCD4]",
    text: "text-white",
    brand: "#00BCD4",
    gradient: "linear-gradient(135deg, #007A8C 0%, #00BCD4 100%)",
    onBrand: "white",
    Logo: HidiveLogo,
    searchUrl: (t) => `https://www.hidive.com/search?q=${encodeURIComponent(t)}`,
  },
  hulu: {
    id: "hulu",
    name: "Hulu",
    short: "H",
    color: "bg-[#1CE783]",
    text: "text-black",
    brand: "#1CE783",
    gradient: "linear-gradient(135deg, #0B0B0B 0%, #1CE783 130%)",
    onBrand: "black",
    Logo: HuluLogo,
    searchUrl: (t) => `https://www.hulu.com/search?q=${encodeURIComponent(t)}`,
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    short: "YT",
    color: "bg-[#FF0000]",
    text: "text-white",
    brand: "#FF0000",
    gradient: "linear-gradient(135deg, #B80000 0%, #FF0000 100%)",
    onBrand: "white",
    Logo: YouTubeLogo,
    searchUrl: (t) => `https://www.youtube.com/results?search_query=${encodeURIComponent(t)}`,
  },
  appletv: {
    id: "appletv",
    name: "Apple TV+",
    short: "TV",
    color: "bg-black",
    text: "text-white",
    brand: "#111111",
    gradient: "linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)",
    onBrand: "white",
    Logo: AppleTVLogo,
    searchUrl: (t) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}`,
  },
  max: {
    id: "max",
    name: "Max",
    short: "MX",
    color: "bg-[#002BE7]",
    text: "text-white",
    brand: "#002BE7",
    gradient: "linear-gradient(135deg, #002BE7 0%, #8200FF 100%)",
    onBrand: "white",
    Logo: MaxLogo,
    searchUrl: (t) => `https://play.max.com/search?q=${encodeURIComponent(t)}`,
  },
};

// Curated mapping for popular series, plus deterministic fallback.
const KNOWN: Record<string, string[]> = {
  "21": ["crunchyroll", "netflix", "hulu"], // One Piece
  "16498": ["crunchyroll", "netflix", "hulu", "disneyplus"], // AoT
  "38000": ["crunchyroll", "netflix", "hulu"], // Demon Slayer
  "31240": ["crunchyroll", "hulu"], // Re:Zero
  "11061": ["netflix", "crunchyroll", "max"], // HxH
  "32281": ["prime", "max"], // Your Name
  "918": ["crunchyroll", "hidive"], // Gintama
};

export function getStreamingFor(anime: Pick<Anime, "id" | "malId">): Platform[] {
  const ids = KNOWN[anime.id];
  if (ids) return ids.map((k) => PLATFORMS[k]).filter(Boolean);
  // deterministic fallback based on malId
  const all = Object.values(PLATFORMS);
  const seed = (anime.malId || 1) % all.length;
  const count = ((anime.malId || 1) % 3) + 2; // 2-4 platforms
  return Array.from({ length: count }, (_, i) => all[(seed + i) % all.length]);
}

export function primaryPlatform(anime: Pick<Anime, "id" | "malId">): Platform {
  return getStreamingFor(anime)[0] ?? PLATFORMS.crunchyroll;
}
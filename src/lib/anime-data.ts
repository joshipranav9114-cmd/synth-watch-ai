import a1 from "@/assets/anime-1.jpg";
import a2 from "@/assets/anime-2.jpg";
import a3 from "@/assets/anime-3.jpg";
import a4 from "@/assets/anime-4.jpg";
import a5 from "@/assets/anime-5.jpg";
import a6 from "@/assets/anime-6.jpg";

export type Anime = {
  id: string;
  title: string;
  image: string;
  genres: string[];
  rating: number;
  year: number;
  episodes: number;
  studio: string;
  match: number;
  synopsis: string;
};

export const ANIME: Anime[] = [
  { id: "neon-genesis", title: "Neon Genesis: Sector 9", image: a1, genres: ["Cyberpunk", "Drama"], rating: 9.4, year: 2025, episodes: 24, studio: "Mappa", match: 98, synopsis: "In a Tokyo drowned in violet rain, a fugitive hacker discovers her memories were rewritten by the very corp she's fighting." },
  { id: "azure-reverie", title: "Azure Reverie", image: a2, genres: ["Sci-Fi", "Romance"], rating: 9.1, year: 2024, episodes: 12, studio: "Ufotable", match: 96, synopsis: "Two strangers wake up in a city that resets every dawn — only one of them remembers." },
  { id: "iron-vow", title: "Iron Vow", image: a3, genres: ["Mecha", "Action"], rating: 8.9, year: 2025, episodes: 26, studio: "Sunrise", match: 94, synopsis: "A rookie pilot inherits a war machine that whispers strategies from a future that hasn't happened yet." },
  { id: "skybound-castle", title: "Skybound: Castle of Cinder", image: a4, genres: ["Fantasy", "Adventure"], rating: 9.3, year: 2024, episodes: 13, studio: "Ghibli", match: 92, synopsis: "A floating fortress sails the sunset clouds, carrying the last library of a forgotten civilization." },
  { id: "blade-of-bloom", title: "Blade of Bloom", image: a5, genres: ["Samurai", "Supernatural"], rating: 9.0, year: 2025, episodes: 12, studio: "Bones", match: 91, synopsis: "Beneath cherry blossoms that never wilt, a wandering ronin hunts the spirit that made him immortal." },
  { id: "after-rain", title: "After Rain Frequency", image: a6, genres: ["Slice of Life", "Music"], rating: 8.7, year: 2024, episodes: 10, studio: "Wit Studio", match: 88, synopsis: "A burnt-out producer rediscovers her sound through midnight walks in neon Shibuya." },
];

export const TRENDING = [ANIME[2], ANIME[0], ANIME[1], ANIME[4]];
export const SEASONAL = [ANIME[3], ANIME[5], ANIME[2], ANIME[1]];
export const FOR_YOU = [ANIME[0], ANIME[1], ANIME[3], ANIME[5], ANIME[4], ANIME[2]];

export const findAnime = (id: string) => ANIME.find((a) => a.id === id);

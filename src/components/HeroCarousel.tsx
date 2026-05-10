import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ANIME } from "@/lib/anime-data";
import { Sparkles } from "lucide-react";

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ANIME.length), 5000);
    return () => clearInterval(t);
  }, []);
  const a = ANIME[i];
  return (
    <Link to="/anime/$id" params={{ id: a.id }} className="relative block h-[440px] w-full overflow-hidden">
      <img src={a.image} alt={a.title} className="h-full w-full object-cover transition-opacity duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      <div className="absolute bottom-6 left-5 right-5">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neon-pink">
          <Sparkles className="h-3 w-3" /> AI Pick · {a.match}% match
        </div>
        <h2 className="text-3xl font-extrabold leading-tight text-foreground">{a.title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {a.studio} · {a.year} · {a.genres.join(" · ")}
        </p>
        <div className="mt-3 flex gap-2">
          {ANIME.map((_, idx) => (
            <span
              key={idx}
              className={`h-1 rounded-full transition-all ${idx === i ? "w-8 bg-gradient-neon" : "w-2 bg-muted"}`}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

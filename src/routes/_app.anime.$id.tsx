import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Play, Sparkles, Star } from "lucide-react";
import { useAnimeById } from "@/lib/anime-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/anime/$id")({ component: Detail });

function Detail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { data: anime, isLoading } = useAnimeById(id);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user || !anime) return;
    supabase.from("watchlist").select("id").eq("user_id", user.id).eq("anime_id", anime.id).maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, anime]);

  if (isLoading) {
    return <main className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</main>;
  }

  if (!anime) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted-foreground">
        Not found. <Link to="/home" className="ml-2 text-neon-pink">Home</Link>
      </main>
    );
  }

  const toggleSave = async () => {
    if (!user) return;
    if (saved) {
      const { error } = await supabase.from("watchlist").delete().eq("user_id", user.id).eq("anime_id", anime.id);
      if (error) { toast.error(error.message); return; }
      setSaved(false);
      toast("Removed from watchlist");
    } else {
      const { error } = await supabase.from("watchlist").insert({
        user_id: user.id, anime_id: anime.id, anime_title: anime.title, anime_image: anime.image, status: "planned",
      });
      if (error) { toast.error(error.message); return; }
      setSaved(true);
      toast.success("Added to your trophy room");
    }
  };

  return (
    <main>
      <div className="relative h-[460px]">
        <img src={anime.image} alt={anime.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

        <button onClick={() => nav({ to: "/home" })} className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full glass">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <button onClick={toggleSave} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full glass">
          {saved ? <BookmarkCheck className="h-4 w-4 text-neon-pink" /> : <Bookmark className="h-4 w-4 text-foreground" />}
        </button>

        <div className="absolute bottom-6 left-5 right-5">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neon-pink">
            <Sparkles className="h-3 w-3" /> {anime.match}% match
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-foreground">{anime.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-neon-cyan"><Star className="h-3 w-3 fill-current" /> {anime.rating}</span>
            <span>·</span><span>{anime.year}</span>
            <span>·</span><span>{anime.episodes} ep</span>
            <span>·</span><span>{anime.studio}</span>
          </div>
        </div>
      </div>

      <section className="px-5 pt-6">
        <div className="flex gap-2">
          <button className="flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-hero py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-neon">
            <Play className="h-4 w-4 fill-current" /> Watch Now
          </button>
          <button onClick={toggleSave} className="flex h-13 items-center justify-center rounded-full glass px-5 text-sm font-bold">
            {saved ? <BookmarkCheck className="h-4 w-4 text-neon-pink" /> : <Bookmark className="h-4 w-4 text-foreground" />}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {anime.genres.map((g: string) => (
            <span key={g} className="rounded-full glass px-3 py-1 text-[11px] font-semibold text-foreground">{g}</span>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-bold uppercase tracking-widest text-neon-cyan">Synopsis</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{anime.synopsis}</p>

        <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-neon-cyan">AI Insight</h3>
        <div className="mt-2 rounded-2xl glass p-4">
          <p className="text-sm text-foreground/90">
            Based on your taste profile, expect <span className="font-bold text-neon-pink">high tear-jerker probability</span> and a strong neo-noir aesthetic. Best viewed at night, headphones on.
          </p>
        </div>
      </section>
    </main>
  );
}

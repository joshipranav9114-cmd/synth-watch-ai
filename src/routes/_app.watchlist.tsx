import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/watchlist")({ component: Watchlist });

type Item = { id: string; anime_id: string; anime_title: string; anime_image: string | null; status: string };

function Watchlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("watchlist").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        setItems((data as Item[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const remove = async (id: string) => {
    const prev = items;
    setItems(items.filter((i) => i.id !== id));
    const { error } = await supabase.from("watchlist").delete().eq("id", id);
    if (error) { setItems(prev); toast.error(error.message); }
  };

  return (
    <main className="px-5 pt-6">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neon-pink">AniVerse AI</p>
        <h1 className="text-3xl font-extrabold text-foreground">Your Trophy Room</h1>
        <p className="mt-1 text-sm text-muted-foreground">A sanctuary of stories that shaped you.</p>
      </div>

      {loading ? (
        <p className="text-center text-sm text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl glass">
            <Bookmark className="h-8 w-8 text-neon-cyan" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Empty Trophy Room</h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">Tap the bookmark on any title to start your collection.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-3 rounded-2xl glass p-2">
              <Link to="/anime/$id" params={{ id: it.anime_id }} className="flex flex-1 items-center gap-3">
                {it.anime_image && (
                  <img src={it.anime_image} alt="" className="h-20 w-16 rounded-xl object-cover" />
                )}
                <div>
                  <p className="font-bold text-foreground">{it.anime_title}</p>
                  <span className="mt-1 inline-block rounded-md bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-pink">{it.status}</span>
                </div>
              </Link>
              <button onClick={() => remove(it.id)} className="mr-2 flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Bookmark, Sparkles, User } from "lucide-react";

const items = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/assistant", icon: Sparkles, label: "AI" },
  { to: "/watchlist", icon: Bookmark, label: "List" },
  { to: "/profile", icon: User, label: "Me" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-md rounded-3xl glass shadow-card">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(({ to, icon: Icon, label }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  active ? "bg-gradient-neon shadow-neon" : ""
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

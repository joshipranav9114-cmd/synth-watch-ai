import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Sparkles, Users, User } from "lucide-react";

const items = [
  { to: "/home",      icon: Home,     label: "Home"      },
  { to: "/search",    icon: Search,   label: "Search"    },
  { to: "/assistant", icon: Sparkles, label: "AI"        },
  { to: "/community", icon: Users,    label: "Community" },
  { to: "/profile",   icon: User,     label: "Me"        },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-md rounded-3xl glass card-glow">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(({ to, icon: Icon, label }) => {
          const active = pathname.startsWith(to);
          return (
            <Link key={to} to={to} className="nav-item press flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5">
              <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${active ? "bg-gradient-hero shadow-neon scale-110 animate-glow nav-pop" : "hover:bg-muted/40 hover:scale-105"}`}>
                <Icon className={`h-5 w-5 transition-colors duration-300 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${active ? "text-neon-orange" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

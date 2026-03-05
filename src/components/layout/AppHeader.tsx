import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { BarChart3, Briefcase, Newspaper, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
];

export function AppHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden text-lg font-bold tracking-tight sm:inline-block">
              Portfolio Intelligence
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={location.pathname === item.to ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 text-sm",
                    location.pathname === item.to && "bg-secondary font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

import { Link, useLocation } from "@tanstack/react-router";
import { Stethoscope, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SidebarItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  role: "Patient" | "Doctor" | "Admin";
  userName: string;
  items: SidebarItem[];
  children: React.ReactNode;
}

export function DashboardLayout({ role, userName, items, children }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
          <Link
            to="/"
            className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Stethoscope className="size-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-sidebar-foreground">
              MediCare
            </span>
          </Link>

          <div className="px-4 pt-5 pb-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {role} portal
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {items.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-xl bg-primary-soft p-3">
              <p className="text-xs font-semibold text-foreground">Need help?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Visit our support center</p>
              <Button asChild size="sm" variant="outline" className="mt-2 h-7 w-full text-xs">
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div>
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <p className="text-sm font-semibold">{userName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">Back to site</Link>
              </Button>
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            </div>
          </header>

          {/* Mobile sidebar nav (horizontal scroll) */}
          <div className="overflow-x-auto border-b border-border bg-background lg:hidden">
            <nav className="flex gap-1 px-4 py-2">
              {items.map((item) => {
                const active = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

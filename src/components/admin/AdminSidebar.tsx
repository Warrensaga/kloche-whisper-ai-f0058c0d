import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  LogOut,
  Home,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/appointments", label: "Appointments", icon: Calendar },
  { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <aside className="w-64 shrink-0 bg-ink text-bone min-h-screen flex flex-col border-r border-ink/30">
      <div className="px-6 py-7 border-b border-bone/10">
        <Link to="/" className="block">
          <p className="font-display text-2xl leading-none">Kloche</p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-soft mt-1.5">
            Atelier · Admin
          </p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {nav.map((item) => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm transition-colors relative ${
                active
                  ? "bg-bone/5 text-bone border-l-2 border-gold"
                  : "text-bone/60 hover:text-bone hover:bg-bone/5 border-l-2 border-transparent"
              }`}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-bone/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm text-bone/60 hover:text-bone hover:bg-bone/5 transition-colors"
        >
          <Home className="size-4" />
          <span>View site</span>
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm text-bone/60 hover:text-bone hover:bg-bone/5 transition-colors"
        >
          <LogOut className="size-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

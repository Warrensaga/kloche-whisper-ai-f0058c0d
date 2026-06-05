import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Users, MessageSquare, Calendar, Briefcase, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { getDashboardStats } from "@/lib/dashboard.functions";

const statsQueryOptions = queryOptions({
  queryKey: ["admin", "dashboard"],
  queryFn: () => getDashboardStats(),
});

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Kloche Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQueryOptions),
  component: DashboardPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-destructive">Failed to load dashboard: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">Not found.</div>,
});

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    new: "bg-gold/15 text-gold border-gold/30",
    read: "bg-muted text-muted-foreground border-border",
    replied: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    confirmed: "bg-gold/15 text-gold border-gold/30",
    cancelled: "bg-muted text-muted-foreground border-border",
    completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  };
  return map[status] ?? "bg-muted text-muted-foreground border-border";
};

function DashboardPage() {
  const { data } = useSuspenseQuery(statsQueryOptions);
  const cards = [
    { label: "Total Clients", value: data.stats.totalClients, icon: Users, href: "/admin/clients" },
    { label: "Enquiries this week", value: data.stats.newEnquiries, icon: MessageSquare, href: "/admin/enquiries" },
    { label: "Appointments this month", value: data.stats.monthAppointments, icon: Calendar, href: "/admin/appointments" },
    { label: "Active projects", value: data.stats.activeProjects, icon: Briefcase, href: "/admin/clients" },
  ];

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Overview</p>
        <h1 className="font-display text-4xl mt-2">
          Good day at the <em className="text-gold not-italic font-display italic">atelier</em>
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.href}
              className="group border border-border bg-card rounded-md p-6 hover:border-gold transition-colors"
            >
              <div className="flex items-start justify-between">
                <Icon className="size-5 text-gold" />
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-gold transition-colors" />
              </div>
              <p className="font-display text-4xl mt-6">{c.value}</p>
              <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mt-2">
                {c.label}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="border border-border bg-card rounded-md">
          <header className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-xl">Recent enquiries</h2>
            <Link to="/admin/enquiries" className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-gold">
              View all
            </Link>
          </header>
          <div className="divide-y divide-border">
            {data.recentEnquiries.length === 0 && (
              <p className="px-6 py-10 text-sm text-muted-foreground text-center">No enquiries yet.</p>
            )}
            {data.recentEnquiries.map((e) => (
              <div key={e.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{e.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{e.service}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {format(new Date(e.created_at), "dd MMM")}
                  </span>
                  <span className={`text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm border ${statusBadge(e.status)}`}>
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-border bg-card rounded-md">
          <header className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-xl">Upcoming appointments</h2>
            <Link to="/admin/appointments" className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-gold">
              Calendar
            </Link>
          </header>
          <div className="divide-y divide-border">
            {data.upcomingAppointments.length === 0 && (
              <p className="px-6 py-10 text-sm text-muted-foreground text-center">Nothing scheduled.</p>
            )}
            {data.upcomingAppointments.map((a) => (
              <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{a.client_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.service}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(a.date), "dd MMM · HH:mm")}
                  </span>
                  <span className={`text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm border ${statusBadge(a.status)}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

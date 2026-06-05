import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    const [clients, newEnquiries, monthAppts, activeProjects, recentEnquiries, upcoming] =
      await Promise.all([
        context.supabase.from("clients").select("id", { count: "exact", head: true }),
        context.supabase
          .from("enquiries")
          .select("id", { count: "exact", head: true })
          .gte("created_at", weekAgo),
        context.supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .gte("date", monthStart)
          .lt("date", monthEnd),
        context.supabase
          .from("clients")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        context.supabase
          .from("enquiries")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
        context.supabase
          .from("appointments")
          .select("*")
          .gte("date", now.toISOString())
          .order("date", { ascending: true })
          .limit(3),
      ]);

    return {
      stats: {
        totalClients: clients.count ?? 0,
        newEnquiries: newEnquiries.count ?? 0,
        monthAppointments: monthAppts.count ?? 0,
        activeProjects: activeProjects.count ?? 0,
      },
      recentEnquiries: recentEnquiries.data ?? [],
      upcomingAppointments: upcoming.data ?? [],
    };
  });

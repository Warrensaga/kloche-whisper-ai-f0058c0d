import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, MessageCircle, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  listEnquiries,
  updateEnquiryStatus,
  convertEnquiryToClient,
} from "@/lib/enquiries.functions";
import { ENQUIRY_STATUSES } from "@/lib/services";

const enquiriesQuery = queryOptions({
  queryKey: ["admin", "enquiries"],
  queryFn: () => listEnquiries(),
});

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries · Kloche Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(enquiriesQuery),
  component: EnquiriesPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-destructive">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">Not found.</div>,
});

function EnquiriesPage() {
  const { data: enquiries } = useSuspenseQuery(enquiriesQuery);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const statusMut = useMutation({
    mutationFn: (v: { id: string; status: "new" | "read" | "replied" }) =>
      updateEnquiryStatus({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const convertMut = useMutation({
    mutationFn: (id: string) => convertEnquiryToClient({ data: { enquiryId: id } }),
    onSuccess: () => {
      toast.success("Converted to client");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div className="p-10 max-w-7xl">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow">Inbox</p>
          <h1 className="font-display text-4xl mt-2">Enquiries</h1>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-card border border-border rounded-sm px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors"
        >
          <option value="all">All ({enquiries.length})</option>
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)} ({enquiries.filter((e) => e.status === s).length})
            </option>
          ))}
        </select>
      </header>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="border border-border bg-card rounded-md p-10 text-center text-muted-foreground text-sm">
            No enquiries here.
          </div>
        )}
        {filtered.map((e) => {
          const isOpen = expanded === e.id;
          const isNew = e.status === "new";
          return (
            <article
              key={e.id}
              className={`border bg-card rounded-md transition-colors ${
                isNew ? "border-l-2 border-l-gold border-border" : "border-border"
              }`}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : e.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
              >
                {isOpen ? <ChevronDown className="size-4 text-muted-foreground shrink-0" /> : <ChevronRight className="size-4 text-muted-foreground shrink-0" />}
                <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.5fr_auto] gap-3 sm:items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{e.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{e.phone}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{e.service}</p>
                  <p className="text-xs text-muted-foreground truncate hidden sm:block">{e.message}</p>
                  <div className="flex items-center gap-3 shrink-0 justify-end">
                    <span className="text-xs text-muted-foreground hidden md:block">
                      {format(new Date(e.created_at), "dd MMM HH:mm")}
                    </span>
                    <StatusPill status={e.status} />
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-border bg-muted/20">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mt-4">
                    {e.message}
                  </p>
                  {e.email && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Email: <a href={`mailto:${e.email}`} className="hover:text-gold">{e.email}</a>
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {e.status !== "read" && (
                      <button
                        onClick={() => statusMut.mutate({ id: e.id, status: "read" })}
                        disabled={statusMut.isPending}
                        className="text-[11px] tracking-[0.2em] uppercase px-3 py-2 rounded-sm border border-border hover:border-gold hover:text-gold transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    {e.status !== "replied" && (
                      <button
                        onClick={() => statusMut.mutate({ id: e.id, status: "replied" })}
                        disabled={statusMut.isPending}
                        className="text-[11px] tracking-[0.2em] uppercase px-3 py-2 rounded-sm border border-border hover:border-gold hover:text-gold transition-colors"
                      >
                        Mark as replied
                      </button>
                    )}
                    {!e.client_id && (
                      <button
                        onClick={() => convertMut.mutate(e.id)}
                        disabled={convertMut.isPending}
                        className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase px-3 py-2 rounded-sm border border-border hover:border-gold hover:text-gold transition-colors"
                      >
                        {convertMut.isPending ? <Loader2 className="size-3 animate-spin" /> : <UserPlus className="size-3" />}
                        Convert to client
                      </button>
                    )}
                    <a
                      href={waLink(e.phone, e.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase px-3 py-2 rounded-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="size-3" /> WhatsApp reply
                    </a>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-gold/15 text-gold border-gold/30",
    read: "bg-muted text-muted-foreground border-border",
    replied: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  };
  return (
    <span className={`text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm border ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}

function waLink(phone: string, name: string) {
  const digits = phone.replace(/[^\d]/g, "").replace(/^0/, "254");
  const msg = encodeURIComponent(`Hello ${name.split(" ")[0]}, this is Kloche Interiors following up on your enquiry.`);
  return `https://wa.me/${digits}?text=${msg}`;
}

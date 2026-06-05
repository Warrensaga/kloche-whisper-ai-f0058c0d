import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { Plus, Search, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listClients, createClient, deleteClient } from "@/lib/clients.functions";
import { SERVICES, CLIENT_STATUSES } from "@/lib/services";

const clientsQuery = queryOptions({
  queryKey: ["admin", "clients"],
  queryFn: () => listClients(),
});

export const Route = createFileRoute("/_authenticated/admin/clients")({
  head: () => ({
    meta: [
      { title: "Clients · Kloche Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(clientsQuery),
  component: ClientsPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-destructive">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">Not found.</div>,
});

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    lead: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    active: "bg-sky-500/10 text-sky-700 border-sky-500/30",
    completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  };
  return map[status] ?? "bg-muted text-muted-foreground border-border";
};

function ClientsPage() {
  const { data: clients } = useSuspenseQuery(clientsQuery);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const delMut = useMutation({
    mutationFn: (id: string) => deleteClient({ data: { id } }),
    onSuccess: () => {
      toast.success("Client deleted");
      qc.invalidateQueries({ queryKey: ["admin"] });
      setToDelete(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = clients.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q);
  });

  return (
    <div className="p-10 max-w-7xl">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow">CRM</p>
          <h1 className="font-display text-4xl mt-2">Clients</h1>
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center gap-2 bg-ink text-bone text-xs tracking-[0.25em] uppercase px-4 py-2.5 rounded-sm hover:bg-gold hover:text-ink transition-colors"
        >
          <Plus className="size-3.5" /> New client
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            placeholder="Search name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border rounded-sm outline-none focus:border-gold transition-colors"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-card border border-border rounded-sm px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors"
        >
          <option value="all">All statuses</option>
          {CLIENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-border bg-card rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground border-b border-border">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Added</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    {clients.length === 0 ? "No clients yet." : "No matches."}
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium">{c.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.phone}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.email ?? "—"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{c.service ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm border ${statusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">
                    {format(new Date(c.created_at), "dd MMM yyyy")}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        to="/admin/clients/$id"
                        params={{ id: c.id }}
                        className="p-1.5 rounded-sm hover:bg-gold/20 hover:text-gold transition-colors"
                        aria-label="View"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <button
                        onClick={() => setToDelete(c.id)}
                        className="p-1.5 rounded-sm hover:bg-destructive/15 hover:text-destructive transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">New client</SheetTitle>
            <SheetDescription>Add a client to your CRM.</SheetDescription>
          </SheetHeader>
          <ClientForm onDone={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this client?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Related enquiries and appointments will be unlinked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && delMut.mutate(toDelete)}
              disabled={delMut.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {delMut.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ClientForm({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    notes: "",
    status: "lead" as "lead" | "active" | "completed",
  });

  const mut = useMutation({
    mutationFn: () => createClient({ data: form }),
    onSuccess: () => {
      toast.success("Client added");
      qc.invalidateQueries({ queryKey: ["admin"] });
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
      className="mt-6 space-y-4"
    >
      <Field label="Full name *">
        <input
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputCls}
        />
      </Field>
      <Field label="Phone *">
        <input
          required
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          className={inputCls}
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          className={inputCls}
        />
      </Field>
      <Field label="Address">
        <input
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          className={inputCls}
        />
      </Field>
      <Field label="Service">
        <select
          value={form.service}
          onChange={(e) => set("service", e.target.value)}
          className={inputCls}
        >
          <option value="">—</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Status">
        <select
          value={form.status}
          onChange={(e) => set("status", e.target.value as typeof form.status)}
          className={inputCls}
        >
          {CLIENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Notes">
        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          className={inputCls}
        />
      </Field>
      <button
        type="submit"
        disabled={mut.isPending}
        className="w-full bg-ink text-bone text-xs tracking-[0.25em] uppercase px-4 py-3 rounded-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
      >
        {mut.isPending && <Loader2 className="size-3 animate-spin" />}
        Save client
      </button>
    </form>
  );
}

const inputCls =
  "w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

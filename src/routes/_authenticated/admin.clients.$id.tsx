import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { getClient, updateClient } from "@/lib/clients.functions";
import { CLIENT_STATUSES } from "@/lib/services";

export const Route = createFileRoute("/_authenticated/admin/clients/$id")({
  head: () => ({
    meta: [
      { title: "Client profile · Kloche Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(makeQuery(params.id)),
  component: ClientProfilePage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-destructive">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">Client not found.</div>,
});

const makeQuery = (id: string) =>
  queryOptions({
    queryKey: ["admin", "client", id],
    queryFn: () => getClient({ data: { id } }),
  });

function ClientProfilePage() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(makeQuery(id));
  const qc = useQueryClient();
  const c = data.client;

  const [form, setForm] = useState({
    name: c.name,
    phone: c.phone,
    email: c.email ?? "",
    address: c.address ?? "",
    status: c.status as "lead" | "active" | "completed",
  });
  const [notes, setNotes] = useState(c.notes ?? "");
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateMut = useMutation({
    mutationFn: (patch: Partial<typeof form> & { notes?: string }) =>
      updateClient({ data: { id, ...patch } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function saveInfo() {
    updateMut.mutate(form, {
      onSuccess: () => toast.success("Client updated"),
    });
  }

  // Auto-save notes 800ms after typing stops
  useEffect(() => {
    if (notes === (c.notes ?? "")) return;
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
      updateMut.mutate({ notes });
    }, 800);
    return () => {
      if (notesTimer.current) clearTimeout(notesTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  return (
    <div className="p-10 max-w-5xl">
      <Link
        to="/admin/clients"
        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-3" /> All clients
      </Link>

      <header className="mb-8">
        <p className="eyebrow">Profile</p>
        <h1 className="font-display text-4xl mt-2">{c.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Added {format(new Date(c.created_at), "dd MMM yyyy")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 border border-border bg-card rounded-md p-6">
          <h2 className="font-display text-xl mb-5">Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Email">
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Address">
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}
                className={inputCls}
              >
                {CLIENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <button
            onClick={saveInfo}
            disabled={updateMut.isPending}
            className="mt-6 bg-ink text-bone text-xs tracking-[0.25em] uppercase px-4 py-2.5 rounded-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {updateMut.isPending && <Loader2 className="size-3 animate-spin" />}
            Save changes
          </button>
        </section>

        <section className="border border-border bg-card rounded-md p-6">
          <h2 className="font-display text-xl mb-4">Notes</h2>
          <textarea
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes — auto-saved on pause."
            className={inputCls + " resize-none"}
          />
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-2">
            Auto-saves
          </p>
        </section>

        <section className="lg:col-span-2 border border-border bg-card rounded-md">
          <header className="px-6 py-4 border-b border-border">
            <h2 className="font-display text-xl">Enquiries</h2>
          </header>
          <div className="divide-y divide-border">
            {data.enquiries.length === 0 && (
              <p className="px-6 py-8 text-sm text-muted-foreground text-center">No enquiries linked.</p>
            )}
            {data.enquiries.map((e) => (
              <div key={e.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{e.service}</p>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(e.created_at), "dd MMM yyyy")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5">{e.message}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-border bg-card rounded-md">
          <header className="px-6 py-4 border-b border-border">
            <h2 className="font-display text-xl">Appointments</h2>
          </header>
          <div className="divide-y divide-border">
            {data.appointments.length === 0 && (
              <p className="px-6 py-8 text-sm text-muted-foreground text-center">None scheduled.</p>
            )}
            {data.appointments.map((a) => (
              <div key={a.id} className="px-6 py-4">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(a.date), "dd MMM yyyy · HH:mm")} · {a.status}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
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

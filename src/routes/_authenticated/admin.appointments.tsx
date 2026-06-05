import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, lazy, Suspense } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { listAppointments, createAppointment, updateAppointment, deleteAppointment } from "@/lib/appointments.functions";
import { listClients } from "@/lib/clients.functions";
import { SERVICES, APPOINTMENT_STATUSES, APPOINTMENT_STATUS_COLORS } from "@/lib/services";

const AppointmentCalendar = lazy(() => import("@/components/admin/AppointmentCalendar"));

const apptsQuery = queryOptions({
  queryKey: ["admin", "appointments"],
  queryFn: () => listAppointments(),
});

const clientsQuery = queryOptions({
  queryKey: ["admin", "clients"],
  queryFn: () => listClients(),
});

export const Route = createFileRoute("/_authenticated/admin/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments · Kloche Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(apptsQuery),
      context.queryClient.ensureQueryData(clientsQuery),
    ]),
  component: AppointmentsPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-destructive">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10">Not found.</div>,
});

type Editing = {
  id?: string;
  title: string;
  clientId: string;
  clientName: string;
  phone: string;
  service: string;
  date: string;
  duration: number;
  status: "confirmed" | "cancelled" | "completed";
  notes: string;
};

const empty: Editing = {
  title: "",
  clientId: "",
  clientName: "",
  phone: "",
  service: SERVICES[0],
  date: "",
  duration: 60,
  status: "confirmed",
  notes: "",
};

function AppointmentsPage() {
  const { data: appts } = useSuspenseQuery(apptsQuery);
  const { data: clients } = useSuspenseQuery(clientsQuery);
  const qc = useQueryClient();

  const [editing, setEditing] = useState<Editing | null>(null);

  const events = useMemo(
    () =>
      appts.map((a) => ({
        id: a.id,
        title: `${a.client_name} · ${a.service}`,
        start: a.date,
        end: new Date(new Date(a.date).getTime() + a.duration * 60000).toISOString(),
        backgroundColor: APPOINTMENT_STATUS_COLORS[a.status],
        borderColor: APPOINTMENT_STATUS_COLORS[a.status],
        extendedProps: { raw: a },
      })),
    [appts],
  );

  const createMut = useMutation({
    mutationFn: (e: Editing) =>
      createAppointment({
        data: {
          title: e.title,
          clientId: e.clientId || null,
          clientName: e.clientName,
          phone: e.phone,
          service: e.service,
          date: new Date(e.date).toISOString(),
          duration: e.duration,
          status: e.status,
          notes: e.notes || undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Appointment saved");
      qc.invalidateQueries({ queryKey: ["admin"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: (e: Editing) =>
      updateAppointment({
        data: {
          id: e.id!,
          title: e.title,
          clientId: e.clientId || null,
          clientName: e.clientName,
          phone: e.phone,
          service: e.service,
          date: new Date(e.date).toISOString(),
          duration: e.duration,
          status: e.status,
          notes: e.notes || undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Appointment updated");
      qc.invalidateQueries({ queryKey: ["admin"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteAppointment({ data: { id } }),
    onSuccess: () => {
      toast.success("Appointment removed");
      qc.invalidateQueries({ queryKey: ["admin"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-8">
        <p className="eyebrow">Schedule</p>
        <h1 className="font-display text-4xl mt-2">Appointments</h1>
      </header>

      <div className="border border-border bg-card rounded-md p-4 sm:p-6 kloche-fc">
        <Suspense fallback={<div className="h-[600px] grid place-items-center text-muted-foreground"><Loader2 className="size-5 animate-spin" /></div>}>
          <AppointmentCalendar
            events={events}
            onDateClick={(d) => {
              setEditing({ ...empty, date: toLocalInput(d) });
            }}
            onEventClick={(id) => {
              const a = appts.find((x) => x.id === id);
              if (!a) return;
              setEditing({
                id: a.id,
                title: a.title,
                clientId: a.client_id ?? "",
                clientName: a.client_name,
                phone: a.phone,
                service: a.service,
                date: toLocalInput(new Date(a.date)),
                duration: a.duration,
                status: a.status as Editing["status"],
                notes: a.notes ?? "",
              });
            }}
          />
        </Suspense>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing?.id ? "Edit appointment" : "New appointment"}
            </DialogTitle>
            <DialogDescription>
              All fields required unless marked optional.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <form
              id="appt-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!editing.title.trim()) editing.title = `${editing.clientName} consultation`;
                if (editing.id) updateMut.mutate(editing);
                else createMut.mutate(editing);
              }}
              className="space-y-4"
            >
              <Field label="Link existing client (optional)">
                <select
                  value={editing.clientId}
                  onChange={(e) => {
                    const c = clients.find((cl) => cl.id === e.target.value);
                    setEditing({
                      ...editing,
                      clientId: e.target.value,
                      clientName: c?.name ?? editing.clientName,
                      phone: c?.phone ?? editing.phone,
                    });
                  }}
                  className={inputCls}
                >
                  <option value="">— Not linked —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Client name *">
                <input
                  required
                  value={editing.clientName}
                  onChange={(e) => setEditing({ ...editing, clientName: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Phone *">
                <input
                  required
                  value={editing.phone}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Title (optional)">
                <input
                  value={editing.title}
                  placeholder="Auto-generated from client + service"
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Service *">
                <select
                  value={editing.service}
                  onChange={(e) => setEditing({ ...editing, service: e.target.value })}
                  className={inputCls}
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date & time *">
                  <input
                    type="datetime-local"
                    required
                    value={editing.date}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Duration (min)">
                  <select
                    value={editing.duration}
                    onChange={(e) => setEditing({ ...editing, duration: +e.target.value })}
                    className={inputCls}
                  >
                    {[30, 60, 90, 120].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Status">
                <select
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as Editing["status"] })}
                  className={inputCls}
                >
                  {APPOINTMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Notes">
                <textarea
                  rows={3}
                  value={editing.notes}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </form>
          )}

          <DialogFooter className="flex sm:justify-between gap-2">
            {editing?.id ? (
              <button
                onClick={() => delMut.mutate(editing.id!)}
                disabled={delMut.isPending}
                className="inline-flex items-center gap-2 text-destructive text-xs tracking-[0.2em] uppercase px-3 py-2 rounded-sm hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="size-3" /> Delete
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              form="appt-form"
              disabled={createMut.isPending || updateMut.isPending}
              className="bg-ink text-bone text-xs tracking-[0.25em] uppercase px-4 py-2.5 rounded-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {(createMut.isPending || updateMut.isPending) && <Loader2 className="size-3 animate-spin" />}
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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

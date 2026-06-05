import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { appointmentSchema, updateAppointmentSchema } from "./validations";

export const listAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("appointments")
      .select("*")
      .order("date", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => appointmentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("appointments")
      .insert({
        title: data.title,
        client_id: data.clientId ?? null,
        client_name: data.clientName,
        phone: data.phone,
        service: data.service,
        date: data.date,
        duration: data.duration,
        status: data.status,
        notes: data.notes ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateAppointmentSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { id, clientId, clientName, ...rest } = data;
    const patch = {
      ...rest,
      ...(clientId !== undefined ? { client_id: clientId } : {}),
      ...(clientName !== undefined ? { client_name: clientName } : {}),
    };
    const { error } = await context.supabase.from("appointments").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("appointments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

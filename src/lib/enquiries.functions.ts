import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  enquirySchema,
  updateEnquiryStatusSchema,
} from "./validations";

// Public submission — uses admin client (no auth required from visitor)
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input) => enquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("enquiries")
      .insert({
        name: data.name,
        phone: data.phone,
        email: data.email ?? null,
        service: data.service,
        message: data.message,
        source: data.source ?? "Website",
      })
      .select("id")
      .single();
    if (error) {
      console.error("submitEnquiry error:", error);
      throw new Error("Could not submit enquiry");
    }
    return { id: row.id };
  });

// Admin: list
export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Admin: update status
export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateEnquiryStatusSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("enquiries")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Admin: convert enquiry to client
export const convertEnquiryToClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ enquiryId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: enquiry, error: e1 } = await context.supabase
      .from("enquiries")
      .select("*")
      .eq("id", data.enquiryId)
      .single();
    if (e1 || !enquiry) throw new Error("Enquiry not found");

    const { data: client, error: e2 } = await context.supabase
      .from("clients")
      .insert({
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        service: enquiry.service,
        notes: enquiry.message,
        status: "lead",
      })
      .select("id")
      .single();
    if (e2 || !client) throw new Error("Could not create client");

    await context.supabase
      .from("enquiries")
      .update({ client_id: client.id, status: "replied" })
      .eq("id", data.enquiryId);

    return { clientId: client.id };
  });

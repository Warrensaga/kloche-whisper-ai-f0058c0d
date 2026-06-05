import { z } from "zod";
import { SERVICES, CLIENT_STATUSES, APPOINTMENT_STATUSES, ENQUIRY_STATUSES } from "./services";

const phoneRegex = /^[\d+\s\-()]{7,20}$/;
const nameRegex = /^[a-zA-Z\u00C0-\u017F'’.\-\s]+$/;

export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100).regex(nameRegex, "Use letters only"),
  phone: z.string().trim().min(7).max(20).regex(phoneRegex, "Invalid phone number"),
  email: z.string().trim().email().max(255).optional().or(z.literal("").transform(() => undefined)),
  service: z.enum([...SERVICES, "Other"] as [string, ...string[]]),
  message: z.string().trim().min(2).max(2000),
  source: z.string().trim().max(60).optional(),
});

export const updateEnquiryStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(ENQUIRY_STATUSES),
});

export const clientSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20).regex(phoneRegex, "Invalid phone number"),
  email: z.string().trim().email().max(255).optional().or(z.literal("").transform(() => undefined)),
  address: z.string().trim().max(255).optional().or(z.literal("").transform(() => undefined)),
  service: z.string().trim().max(60).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().trim().max(5000).optional().or(z.literal("").transform(() => undefined)),
  status: z.enum(CLIENT_STATUSES).default("lead"),
});

export const updateClientSchema = clientSchema.partial().extend({
  id: z.string().uuid(),
});

export const appointmentSchema = z.object({
  title: z.string().trim().min(2).max(120),
  clientId: z.string().uuid().nullable().optional(),
  clientName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20).regex(phoneRegex, "Invalid phone number"),
  service: z.string().trim().min(2).max(60),
  date: z.string().min(1, "Date is required"),
  duration: z.number().int().min(15).max(480).default(60),
  status: z.enum(APPOINTMENT_STATUSES).default("confirmed"),
  notes: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
});

export const updateAppointmentSchema = appointmentSchema.partial().extend({
  id: z.string().uuid(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;

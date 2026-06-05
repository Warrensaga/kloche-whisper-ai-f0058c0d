export const SERVICES = [
  "Interior Design",
  "Renovation",
  "Short Let Styling",
  "Office Design",
  "Space Planning",
  "Furniture & Decor",
] as const;

export type ServiceName = (typeof SERVICES)[number];

export const ENQUIRY_STATUSES = ["new", "read", "replied"] as const;
export const CLIENT_STATUSES = ["lead", "active", "completed"] as const;
export const APPOINTMENT_STATUSES = ["confirmed", "cancelled", "completed"] as const;

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  confirmed: "#b89460",
  cancelled: "#9ca3af",
  completed: "#10a37f",
};

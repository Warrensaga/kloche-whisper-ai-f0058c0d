
# Plan: Kloche Interiors Admin + CRM on TanStack Start

The existing landing page (`src/components/Landing.tsx`, `src/components/KloAI.tsx`) stays as-is. Everything below is additive.

## 1. Backend (Lovable Cloud)

Enable Lovable Cloud, then create three tables via migration with proper RLS:

- **`enquiries`** — id, name, phone, email, service, message, status (`new|read|replied`), client_id (nullable FK), created_at
- **`clients`** — id, name, phone, email, address, notes, status (`lead|active|completed`), created_at, updated_at
- **`appointments`** — id, title, client_id (nullable FK), client_name, phone, service, date (timestamptz), duration (int, default 60), status (`confirmed|cancelled|completed`), notes, created_at

RLS: admin pages are protected behind a `_authenticated` layout, so all tables grant full CRUD to `authenticated`. The public enquiry form posts via a server function using `supabaseAdmin` (no auth required to submit).

## 2. Auth gate for admin

The spec says "no auth required, add note for production." That creates a publicly accessible admin. I'll instead add **email/password sign-in** using Lovable Cloud auth (one owner account), gated via the `_authenticated` layout — this is the minimum viable security and matches the stack's auth pattern. A `/auth` page lets the owner sign in.

## 3. Email notifications

Set up Lovable Emails (app email infrastructure) and create one template `new-enquiry-notification` that sends to the owner whenever a new enquiry is submitted. The owner's email address is configured via the email domain.

## 4. Server functions (`src/lib/*.functions.ts`)

- `enquiries.functions.ts` — `submitEnquiry` (public, admin client + send email), `listEnquiries`, `updateEnquiryStatus`, `convertEnquiryToClient` (auth)
- `clients.functions.ts` — `listClients`, `getClient`, `createClient`, `updateClient`, `deleteClient` (auth)
- `appointments.functions.ts` — `listAppointments`, `createAppointment`, `updateAppointment`, `deleteAppointment` (auth)

Zod validation on every input. Public `submitEnquiry` validates strictly and never returns sensitive data.

## 5. Routes (`src/routes/`)

- `auth.tsx` — sign-in page (email/password)
- `_authenticated/route.tsx` — gate, ssr: false
- `_authenticated/admin.tsx` — admin shell layout with sidebar, renders `<Outlet />`
- `_authenticated/admin.index.tsx` — dashboard (stat cards + recent enquiries + upcoming appointments)
- `_authenticated/admin.clients.tsx` — clients table with search/filter + add-client slide-over
- `_authenticated/admin.clients.$id.tsx` — client profile (info, enquiries, appointments, notes)
- `_authenticated/admin.appointments.tsx` — FullCalendar with create/edit modal
- `_authenticated/admin.enquiries.tsx` — enquiries table with status actions

Each admin route has its own `head()` (noindex), `errorComponent`, and `notFoundComponent`.

## 6. Components (`src/components/admin/`)

`AdminSidebar`, `DashboardStats`, `ClientsTable`, `ClientForm` (slide-over via Sheet), `AppointmentCalendar` (FullCalendar wrapper), `AppointmentModal` (Dialog), `EnquiriesTable`. All use existing shadcn UI primitives and the established cream/charcoal/gold tokens — no new color tokens.

## 7. Wire the public contact form

Update `KloAI.tsx` to POST to the new `submitEnquiry` server fn instead of the placeholder Make.com webhook. Keep the WhatsApp fallback on error.

## 8. Dependencies to install

`@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/interaction`, `date-fns`, `react-hook-form`, `@hookform/resolvers`, `zod` (likely present), `react-hot-toast` (use existing `sonner` instead — same project already has it).

## Technical notes (non-user-facing)

- Stack: TanStack Start + Vite + React 19 (not Next.js). File routes under `src/routes/`, not `app/`.
- Database: Postgres via Lovable Cloud (not SQLite/Prisma). Schema via SQL migration.
- Email: Lovable Emails queue (not Nodemailer/Gmail SMTP).
- Calendar: `@fullcalendar/react` works in the Worker SSR runtime when only used in client components (lazy import).
- Toasts: reuse existing `sonner` (already in shadcn setup) rather than adding `react-hot-toast`.

## Out of scope (will not build)

- NextAuth (stack is not Next.js — Lovable Cloud auth replaces it)
- Prisma/SQLite migration files
- Vercel deployment config (project deploys via Lovable's Publish flow)
- README rewrite (project README is managed by Lovable)

Confirm and I'll start building.

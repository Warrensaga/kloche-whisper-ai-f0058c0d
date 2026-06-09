import { useState, type ComponentType, type FormEvent } from "react";
import {
  ArrowUpRight,
  MapPin,
  Instagram,
  Phone,
  Mail,
  Star,
  Check,
  Menu,
  X,
  Sparkles,
  Hammer,
  Compass,
  Sofa,
  Building2,
  Wrench,
  Loader2,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import heroImg from "@/assets/hero.jpg";
import westlandsImg from "@/assets/project-westlands.jpg";
import kilimaniImg from "@/assets/project-kilimani.jpg";
import karenImg from "@/assets/project-karen.jpg";
import founderImg from "@/assets/founder-esther.jpg";
import renoKileleshwa from "@/assets/renovation-kileleshwa.jpg";
import renoKaruna from "@/assets/renovation-karuna-studio.jpg";
import renoAttic from "@/assets/renovation-attic-loft.jpg";
import renoExec from "@/assets/renovation-executive-suite.jpg";
import { submitEnquiry } from "@/lib/enquiries.functions";
import { SERVICES } from "@/lib/services";

const WHATSAPP_NUMBER = "254717634003";
const WHATSAPP = `https://wa.me/${WHATSAPP_NUMBER}`;
const EMAIL = "klocheinteriors@gmail.com";
const PHONE_DISPLAY = "0717 634 003";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#renovations", label: "Renovations" },
  { href: "#process", label: "Process" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="container-luxe flex items-center justify-between h-20">
        <a href="#top" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl tracking-tight">KLOCHE</span>
          <span className="eyebrow !text-[10px] !tracking-[0.3em] text-muted-foreground group-hover:text-gold transition-colors">
            Interiors
          </span>
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-[0.18em] uppercase text-foreground/80 hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden sm:inline-flex group items-center gap-2 bg-ink text-bone text-xs tracking-[0.2em] uppercase px-5 py-3 rounded-sm hover:bg-gold hover:text-ink transition-colors"
        >
          Get a Quote
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <div className="container-luxe py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm tracking-[0.15em] uppercase border-b border-border/40 hover:text-gold"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 bg-ink text-bone text-xs tracking-[0.2em] uppercase px-5 py-3 rounded-sm"
            >
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-end overflow-hidden"
    >
      <img
        src={heroImg}
        alt="Luxury living space by Kloche Interiors"
        width={1920}
        height={1080}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />

      <div className="relative container-luxe pb-20 pt-32 text-bone animate-fade-up">
        <p className="eyebrow !text-gold-soft mb-6">
          Bespoke Interior Architects · Nairobi
        </p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl leading-[0.95] max-w-5xl">
          Sanctuaries of <em className="not-italic text-gold">quiet luxury</em>
          <br />
          and form.
        </h1>
        <p className="mt-8 max-w-2xl text-base sm:text-lg text-bone/70 leading-relaxed">
          We translate architectural volume into timeless, structural homes and
          spaces. Integrating custom stonework, rich walnut paneling, and warm
          linen, Kloche Interiors crafts experiences tailored for Nairobi's most
          discerning homeowners.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 bg-gold text-ink text-xs tracking-[0.25em] uppercase px-7 py-4 rounded-sm hover:bg-bone transition-colors"
          >
            Book a Consultation
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase border-b border-bone/40 pb-1 hover:border-gold hover:text-gold transition-colors"
          >
            View Our Projects
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
          {[
            {
              k: "4.8★ Client Rating",
              v: "Verified Local Google Reviews",
            },
            {
              k: "100+ Masterpieces",
              v: "Residential & Commercial Kenya",
            },
            {
              k: "Bespoke Blueprinting",
              v: "Concept plans to final handover",
            },
          ].map((s) => (
            <div
              key={s.k}
              className="border-t border-bone/20 pt-4 text-bone/80"
            >
              <p className="font-display text-lg text-gold">{s.k}</p>
              <p className="text-xs tracking-[0.18em] uppercase mt-1 text-bone/60">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    n: "01",
    icon: Sofa,
    title: "Residential Interior Design",
    desc: "Complete layout design and materials curation for upscale private residences. We orchestrate architectural elements, custom joinery, lighting plan layouts, and bespoke surface selections from the ground up.",
  },
  {
    n: "02",
    icon: Building2,
    title: "Commercial Interior Design",
    desc: "Bespoke identity-driven layouts for boutique commercial suites, retail spaces, and creative workspaces. We optimize practical workflow configurations without compromising sophisticated aesthetic presence.",
  },
  {
    n: "03",
    icon: Compass,
    title: "Space Planning",
    desc: "Comprehensive study of volume, footprint usage, and walking coordinates. We refine spatial circulation patterns, analyze sightlines, and establish correct scale relationships.",
  },
  {
    n: "04",
    icon: Sparkles,
    title: "Furniture & Decor Selection",
    desc: "Curated sourcing of physical artisan furniture, customized upholstery textiles, luxury floor coverings, and styling ornaments. We arrange items to form cohesive dimensional depth.",
  },
  {
    n: "05",
    icon: Wrench,
    title: "Renovation Consultation",
    desc: "Detailed forensic assessment of older building volumes. We deliver full physical structural restructuring, wall removal guidance, material replacement logs, and progress coordination.",
  },
  {
    n: "06",
    icon: Hammer,
    title: "Custom Design Solutions",
    desc: "Tailored architectural solutions including custom fireplace mantels, wood slatted panels, recessed indirect display niches, and bespoke cabinetry crafted to your specific life requirements.",
  },
];

function Services() {
  return (
    <section id="services" className="py-28 sm:py-40 bg-secondary">
      <div className="container-luxe">
        <div className="max-w-3xl mb-16">
          <p className="eyebrow mb-4">Bespoke Expertise</p>
          <h2 className="font-display text-4xl sm:text-6xl leading-[1.05]">
            Our services and{" "}
            <em className="not-italic text-gold">solutions</em>.
          </h2>
          <p className="mt-6 text-foreground/70 max-w-2xl leading-relaxed">
            From styling residential rooms to managing high-profile office
            renovations, Kloche Interiors delivers pristine craftsmanship at
            every milestone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative bg-background p-8 sm:p-10 min-h-[320px] flex flex-col gap-5 hover:bg-ink hover:text-bone transition-colors duration-500"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl text-gold">{s.n}</span>
                <s.icon
                  className="size-7 text-foreground/60 group-hover:text-gold transition-colors"
                  strokeWidth={1.25}
                />
              </div>
              <h3 className="font-display text-2xl leading-tight">{s.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/70 group-hover:text-bone/70 transition-colors">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <p className="text-foreground/70">
            Have a custom property or design scope?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase border-b border-foreground/40 pb-1 hover:border-gold hover:text-gold transition-colors"
          >
            Consult Our Studio
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-28 sm:py-40">
      <div className="container-luxe grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <img
            src={founderImg}
            alt="Esther Kloche during a bespoke materials study in Westlands"
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full h-[560px] object-cover"
          />
          <div className="absolute -bottom-6 -right-6 bg-ink text-bone p-6 max-w-xs hidden sm:block">
            <p className="eyebrow !text-gold-soft mb-2">Nairobi, KE</p>
            <p className="text-sm leading-relaxed">
              Authentic material boards — Walnut, Linen, Slate, Brass.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Star className="size-4 text-gold fill-gold" />
              <span className="font-display text-xl">4.8</span>
              <span className="text-xs text-bone/60">
                · 10 Verified Google Reviews
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-7">
          <p className="eyebrow mb-4">Founder Profile & Story</p>
          <h2 className="font-display text-4xl sm:text-5xl leading-[1.05]">
            Esther Kloche
            <br />
            and the <em className="not-italic text-gold">soul</em> of the
            studio.
          </h2>
          <div className="mt-6 space-y-5 text-foreground/80 leading-relaxed">
            <p>
              "I started Kloche Interiors with a simple realization: spaces are
              not just structures to occupy; they are canvases for the soul,"
              says founder and principal interior designer{" "}
              <strong>Esther Kloche</strong>. "After years of practicing design
              in sub-Saharan Africa, I felt a deep pull to return to honest,
              natural resources and create a studio on Karuna Road that honors
              them."
            </p>
            <p>
              Our studio rejects the cold, sterile assembly-line look that
              occupies much of modern design. Instead, we spend our days
              collaborating directly with local Kenyan wood artisans, veteran
              stonemasons, and textile curators.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {[
              [
                "Earthy Harmony",
                "Balancing warm travertine, raw timber, and calm textiles.",
              ],
              [
                "Artisan Respect",
                "Hand-joined timber craftsmanship and customized metal hardware.",
              ],
              [
                "Physical Integrity",
                "Detailing furniture depth and walking coordinates for perfect flow.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-t border-border pt-4">
                <p className="font-display text-lg text-gold">{t}</p>
                <p className="text-xs text-foreground/70 leading-relaxed mt-2">
                  {d}
                </p>
              </div>
            ))}
          </div>

          <blockquote className="mt-10 border-l-2 border-gold pl-6 italic text-foreground/80">
            "Kloche Interiors did not compile layout drawings from Pinterest;
            they constructed a custom sanctuary. The physical timber accents in
            our Lavington house feel like a living art gallery."
            <footer className="not-italic mt-3 text-xs tracking-[0.2em] uppercase text-muted-foreground">
              — Givence Awuor · Nairobi Residence Client
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

const portfolio = [
  {
    img: kilimaniImg,
    tag: "Full Concept Interior Design",
    title: "The Kileleshwa Residency",
  },
  {
    img: westlandsImg,
    tag: "Brand-Aligned Workspaces",
    title: "Gigiri Executive Offices",
  },
  {
    img: karenImg,
    tag: "Furniture Sourcing & Styling",
    title: "Lavington Penthouse",
  },
  {
    img: renoKileleshwa,
    tag: "Short Let Styling",
    title: "Westlands Airbnb Retreat",
  },
  {
    img: renoAttic,
    tag: "Room Remodelling",
    title: "The Kilimani Townhouse",
  },
];

function Portfolio() {
  return (
    <section id="portfolio" className="py-28 sm:py-40 bg-ink text-bone">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <p className="eyebrow !text-gold-soft mb-4">
              Editorial Selected Works
            </p>
            <h2 className="font-display text-4xl sm:text-6xl leading-[1.05]">
              Crafted homes &{" "}
              <em className="not-italic text-gold">renovated spaces</em>.
            </h2>
            <p className="mt-6 text-bone/70 max-w-2xl">
              We move beyond shallow aesthetics. Explore the specific design
              goals, complex challenges, and physical hand-crafted material
              outcomes defining Kloche Interiors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((p, i) => (
            <article
              key={p.title}
              className={`group relative overflow-hidden bg-ink/40 ${
                i === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1280}
                  height={1280}
                  className={`w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04] ${
                    i === 0 ? "h-[420px] lg:h-[680px]" : "h-[360px]"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="eyebrow !text-gold-soft mb-2">{p.tag}</p>
                <h3 className="font-display text-2xl sm:text-3xl">{p.title}</h3>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <a
            href="https://instagram.com/kloche_interiors"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-bone/80 hover:text-gold transition-colors"
          >
            <Instagram className="size-4" /> Live projects on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

const renovations = [
  {
    img: renoKaruna,
    location: "Karuna Road, Nairobi",
    style: "Warm Minimalist Workplace",
    title: "The Karuna Creative Studio",
    desc: "Renovation of an old warehouse into a bright, sleek, and highly functional workspace for a boutique design agency. Focused on improving natural airflow, spatial circulation, and incorporating custom oak carpentry.",
    weeks: "10 Weeks",
    sqft: "1,200 sq ft",
  },
  {
    img: renoAttic,
    location: "Lavington, Nairobi",
    style: "Monolithic Heritage Elegance",
    title: "The Attic Loft Sanctuary",
    desc: "A dramatic attic conversion for a creative director. We preserved the heritage timber beams while introducing modern floating library shelving, lush linen upholstery, and a warm tone-on-tone color palette.",
    weeks: "14 Weeks",
    sqft: "950 sq ft",
  },
  {
    img: renoKileleshwa,
    location: "Gigiri, Nairobi",
    style: "Tactile Industrial Chic",
    title: "The Atelier Focus Lounge",
    desc: "Renovation of a dark interior room into a vibrant hub of physical moodboards, warm meeting lounges, and materials exploration libraries. Strong focus on tactile textures, brass finishes, and cozy boucle materials.",
    weeks: "8 Weeks",
    sqft: "800 sq ft",
  },
  {
    img: renoExec,
    location: "Westlands, Nairobi",
    style: "Quiet Luxury & High-End Editorial",
    title: "The Executive Consultation Suite",
    desc: "An upscale luxury consultation lounge and private executive suite featuring heavy fluted walnut paneling, massive brass-lined arches, pristine herringbone flooring, and custom architectural glass partitions.",
    weeks: "16 Weeks",
    sqft: "1,500 sq ft",
  },
];

function Renovations() {
  return (
    <section id="renovations" className="py-28 sm:py-40">
      <div className="container-luxe">
        <div className="max-w-3xl mb-16">
          <p className="eyebrow mb-4">Studio Renovations</p>
          <h2 className="font-display text-4xl sm:text-6xl leading-[1.05]">
            Portfolio <em className="not-italic text-gold">projects</em>.
          </h2>
          <p className="mt-6 text-foreground/70 max-w-2xl">
            Take a deep dive into our architectural transformations. Each
            renovation below shows technical outlines, planning phases, and
            layout updates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {renovations.map((r) => (
            <article key={r.title} className="group">
              <div className="overflow-hidden">
                <img
                  src={r.img}
                  alt={r.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="w-full h-[420px] object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                />
              </div>
              <div className="pt-6 space-y-3">
                <p className="eyebrow text-gold-soft">{r.style}</p>
                <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                  {r.location}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl">{r.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {r.desc}
                </p>
                <div className="flex items-center gap-6 pt-3 border-t border-border">
                  <span className="text-xs tracking-[0.18em] uppercase text-foreground/60">
                    {r.weeks}
                  </span>
                  <span className="text-xs tracking-[0.18em] uppercase text-foreground/60">
                    {r.sqft}
                  </span>
                  <a
                    href="#contact"
                    className="ml-auto inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-foreground hover:text-gold transition-colors"
                  >
                    View Details <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const processSteps = [
  {
    n: "01",
    phase: "Discovery",
    title: "Site Audit & Briefing",
    desc: "Our journey begins on-site in Nairobi. We perform detailed spatial dimension scans, capture lighting coordinates, and establish your budget, milestones, and physical life expectations.",
  },
  {
    n: "02",
    phase: "Concept Development",
    title: "Moodboards & Volumes",
    desc: "We shape raw ideas into direction boards, curating physical stone swatches, timber specimens, and volumetric sketches to establish a grounded, cohesive mood landscape.",
  },
  {
    n: "03",
    phase: "Design Presentation",
    title: "Blueprints & Scale Models",
    desc: "We deliver full architectural floorplans, customized section layouts, and high-fidelity specifications, detailing how every physical fitting aligns with the home's flow.",
  },
  {
    n: "04",
    phase: "Implementation",
    title: "Artisan Construction",
    desc: "We coordinate on-site with vetted contractors. From drywall framing and electrical track fittings to bespoke walnut joinery installation, we oversee every milestone's precision.",
  },
  {
    n: "05",
    phase: "Final Styling",
    title: "Curated Dressing",
    desc: "The final reveal. We position custom upholstered sofas, hang curated local artwork, line table elements with bespoke ornaments, and run meticulous fit-and-finish inspections.",
  },
];

function Process() {
  return (
    <section id="process" className="py-28 sm:py-40 bg-secondary">
      <div className="container-luxe">
        <div className="max-w-3xl mb-16">
          <p className="eyebrow mb-4">The Journey</p>
          <h2 className="font-display text-4xl sm:text-6xl leading-[1.05]">
            Our design and{" "}
            <em className="not-italic text-gold">execution process</em>.
          </h2>
        </div>
        <ol className="space-y-px bg-border">
          {processSteps.map((s) => (
            <li
              key={s.n}
              className="bg-background grid grid-cols-1 md:grid-cols-12 gap-6 p-8 sm:p-10 hover:bg-ink hover:text-bone transition-colors duration-500 group"
            >
              <div className="md:col-span-1 font-display text-3xl text-gold">
                {s.n}
              </div>
              <div className="md:col-span-3">
                <p className="eyebrow text-foreground/60 group-hover:text-bone/60">
                  {s.phase}
                </p>
                <h3 className="font-display text-2xl mt-2">{s.title}</h3>
              </div>
              <p className="md:col-span-8 text-foreground/70 group-hover:text-bone/70 leading-relaxed">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const reviews = [
  {
    quote:
      "Working with Kloche Interiors was such a smooth and enjoyable process. They have a unique eye for design and really bring spaces to life.",
    name: "Givence Awuor",
    role: "Residential Client",
  },
  {
    quote:
      "Great experience with attention to detail and personalization. Went above and beyond.",
    name: "Ogare Ted",
    role: "Commercial Partner",
  },
  {
    quote:
      "Unparalleled expertise in renovation and interior decoration. Remarkable company.",
    name: "Amanda Kimani",
    role: "Airbnb Host / Short Let Styling",
  },
];

function Reviews() {
  return (
    <section id="reviews" className="py-28 sm:py-40">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="eyebrow mb-4">Direct Feedback</p>
            <h2 className="font-display text-4xl sm:text-6xl leading-[1.05]">
              Client testimonials &{" "}
              <em className="not-italic text-gold">praises</em>.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 fill-gold text-gold" />
              ))}
            </div>
            <div>
              <p className="font-display text-xl">4.8 Stars</p>
              <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                10 Google Reviews
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="bg-secondary p-8 flex flex-col justify-between min-h-[280px]"
            >
              <blockquote className="font-display text-xl leading-snug">
                "{r.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-6 border-t border-border">
                <p className="font-display text-lg">{r.name}</p>
                <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mt-1">
                  {r.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactBand() {
  return (
    <section className="bg-ink text-bone py-20">
      <div className="container-luxe text-center max-w-3xl">
        <p className="eyebrow !text-gold-soft mb-4">Direct Line</p>
        <h2 className="font-display text-3xl sm:text-5xl leading-[1.05]">
          Ready to transform your space?
        </h2>
        <p className="mt-6 text-bone/70">
          Chat with the Kloche Interiors design studio instantly. We are online
          and ready to discuss layouts, material styling, budget structures, or
          walkthrough dates.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={`${WHATSAPP}?text=${encodeURIComponent(
              "Hello Kloche Interiors, I'd like to chat about my space."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gold text-ink text-xs tracking-[0.25em] uppercase px-7 py-4 rounded-sm hover:bg-bone transition-colors"
          >
            <Phone className="size-4" /> Chat on WhatsApp Now
          </a>
        </div>
        <p className="mt-6 text-xs tracking-[0.25em] uppercase text-bone/50">
          Studio at Karuna Rd, Nairobi · Available Mon–Sat
        </p>
      </div>
    </section>
  );
}

function ContactForm() {
  const submit = useServerFn(submitEnquiry);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim() || undefined,
      service: String(fd.get("service") || "") as (typeof SERVICES)[number],
      message: String(fd.get("message") || "").trim(),
      source: "Website Contact Form",
    };

    try {
      await submit({ data: payload });
      setStatus("done");
      const waMsg = `Hello Kloche Interiors, I'm ${payload.name}. I'm interested in ${payload.service}. ${payload.message}`;
      window.open(
        `${WHATSAPP}?text=${encodeURIComponent(waMsg)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Could not submit. Please WhatsApp us directly.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name *" name="name" placeholder="e.g. Amanda Kimani" required />
        <Field
          label="Phone Number *"
          name="phone"
          type="tel"
          placeholder="e.g. 0717 634003"
          required
        />
      </div>
      <Field
        label="Email Address"
        name="email"
        type="email"
        placeholder="e.g. client@domain.com"
      />
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase mb-2 text-foreground/70">
          Select Service *
        </label>
        <select
          name="service"
          required
          defaultValue=""
          className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
        >
          <option value="" disabled>
            — Choose Option —
          </option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase mb-2 text-foreground/70">
          Project Message / Brief *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about your space. Do you need concept blueprints, custom remodelling, materials sourcing, or a specific handover date?"
          className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group w-full inline-flex items-center justify-center gap-3 bg-ink text-bone text-xs tracking-[0.25em] uppercase px-7 py-4 rounded-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Submitting…
          </>
        ) : status === "done" ? (
          <>
            <Check className="size-4" /> Sent — Opening WhatsApp
          </>
        ) : (
          <>
            Submit & Connect on WhatsApp
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        * Clicking submit logs your details to our studio lead management and
        immediately forwards you to WhatsApp chat for instant discussion.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs tracking-[0.2em] uppercase mb-2 text-foreground/70">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
      />
    </div>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-28 sm:py-40 bg-secondary">
      <div className="container-luxe grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-4">Get In Touch</p>
          <h2 className="font-display text-4xl sm:text-5xl leading-[1.05]">
            Connect with our <em className="not-italic text-gold">studio</em>.
          </h2>
          <p className="mt-6 text-foreground/70 leading-relaxed">
            Describe your commercial design, home remodeling, or short let
            layout ideas. Our studio handles concept design through complete
            physical fit-outs.
          </p>

          <div className="mt-10 space-y-6">
            <ContactItem
              icon={MapPin}
              label="Our Location"
              lines={["Karuna Rd, Westlands", "Nairobi, Kenya"]}
            />
            <ContactItem
              icon={Phone}
              label="Call / WhatsApp"
              lines={[PHONE_DISPLAY, "● Online (8am – 5pm)"]}
              href={WHATSAPP}
            />
            <ContactItem
              icon={Mail}
              label="Email"
              lines={[EMAIL]}
              href={`mailto:${EMAIL}`}
            />
            <ContactItem
              icon={Compass}
              label="Studio Hours"
              lines={["Mon – Sat: 8:00 AM – 5:00 PM", "Sundays: Closed"]}
            />
          </div>

          <div className="mt-10">
            <p className="eyebrow mb-3">Our Social Networks</p>
            <div className="flex gap-3">
              {[
                { label: "Instagram", href: "https://instagram.com/kloche_interiors" },
                { label: "TikTok", href: "https://tiktok.com/@kloche_interiors" },
                { label: "LinkedIn", href: "https://linkedin.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-border text-xs tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-background p-8 sm:p-10 border border-border">
          <p className="eyebrow mb-2">Send an Enquiry</p>
          <h3 className="font-display text-2xl sm:text-3xl mb-8">
            Tell us about your project.
          </h3>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon: Icon,
  label,
  lines,
  href,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  lines: string[];
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4">
      <Icon className="size-5 text-gold mt-1 shrink-0" />
      <div>
        <p className="eyebrow text-foreground/60 mb-1">{label}</p>
        {lines.map((l) => (
          <p key={l} className="text-sm text-foreground/80 leading-relaxed">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block hover:text-gold transition-colors"
    >
      {inner}
    </a>
  ) : (
    inner
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-bone/80 pt-20 pb-10">
      <div className="container-luxe grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <p className="font-display text-3xl text-bone">KLOCHE</p>
          <p className="eyebrow !text-gold-soft mt-2">Interiors</p>
          <p className="mt-4 text-sm leading-relaxed text-bone/60">
            Spaces that inspire, lives well lived. Premium interior architecture
            and master renovation services in Nairobi, Kenya. We craft bespoke
            luxury experiences.
          </p>
        </div>
        <div>
          <p className="eyebrow !text-gold-soft mb-4">Our Services</p>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.title}>
                <a href="#services" className="hover:text-gold transition-colors">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-gold-soft mb-4">Quick Links</p>
          <ul className="space-y-2 text-sm">
            {[
              ["#top", "Home"],
              ["#about", "About Studio"],
              ["#portfolio", "Our Work"],
              ["#process", "Process Model"],
              ["#reviews", "Client Reviews"],
              ["#contact", "Contact Desk"],
            ].map(([h, l]) => (
              <li key={l}>
                <a href={h} className="hover:text-gold transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-gold-soft mb-4">Contact Studio</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="size-4 mt-1 text-gold shrink-0" />
              Karuna Rd, Nairobi, Kenya
            </li>
            <li>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Phone className="size-4 text-gold" /> {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Mail className="size-4 text-gold" /> {EMAIL}
              </a>
            </li>
            <li className="text-bone/60">
              Mon – Sat: 8:00 AM – 5:00 PM
              <br />
              Sundays: Closed
            </li>
          </ul>
        </div>
      </div>
      <div className="container-luxe pt-8 border-t border-bone/10 flex flex-col sm:flex-row gap-4 justify-between text-xs text-bone/50">
        <p>© {new Date().getFullYear()} Kloche Interiors. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gold">Terms of Use</a>
          <a href="#" className="hover:text-gold">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Services />
        <About />
        <Portfolio />
        <Renovations />
        <Process />
        <Reviews />
        <ContactBand />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

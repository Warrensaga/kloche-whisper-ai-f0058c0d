import { ArrowUpRight, MapPin, Instagram, Sofa, Building2, Compass, Phone } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import westlandsImg from "@/assets/project-westlands.jpg";
import kilimaniImg from "@/assets/project-kilimani.jpg";
import karenImg from "@/assets/project-karen.jpg";

const WHATSAPP = "https://wa.me/254717634003";

function Nav() {
  const links = [
    { href: "#projects", label: "Projects" },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="container-luxe flex items-center justify-between h-20">
        <a href="#top" className="flex items-baseline gap-2 group">
          <span className="font-display text-2xl tracking-tight">Kloche</span>
          <span className="eyebrow !text-[10px] !tracking-[0.3em] text-muted-foreground group-hover:text-gold transition-colors">
            Interiors
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide text-foreground/80 hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#consult"
          className="group inline-flex items-center gap-2 bg-ink text-bone text-xs tracking-[0.2em] uppercase px-5 py-3 rounded-sm hover:bg-gold hover:text-ink transition-colors"
        >
          Book Consultation
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-end overflow-hidden">
      <img
        src={heroImg}
        alt="Luxury interior design Nairobi — moody sunset living room with brass accents"
        width={1920}
        height={1080}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />

      <div className="relative container-luxe pb-20 pt-32 text-bone animate-fade-up">
        <p className="eyebrow !text-gold-soft mb-6">Westlands · Nairobi · Est. Kloche</p>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl leading-[0.95] max-w-5xl">
          Luxury Interior Design <em className="not-italic text-gold">in Nairobi</em>
          <br />
          <span className="text-bone/80">& Premium Office Fit-Outs in Westlands.</span>
        </h1>
        <p className="mt-8 max-w-xl text-base sm:text-lg text-bone/70 leading-relaxed">
          A turnkey atelier curating residential sanctuaries and commercial environments for
          Nairobi's most discerning clients and developers.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#consult"
            className="group inline-flex items-center gap-3 bg-gold text-ink text-xs tracking-[0.25em] uppercase px-7 py-4 rounded-sm hover:bg-bone transition-colors"
          >
            Begin a Project
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase border-b border-bone/40 pb-1 hover:border-gold hover:text-gold transition-colors"
          >
            View Signature Work
          </a>
        </div>
      </div>
    </section>
  );
}

const projects = [
  {
    img: westlandsImg,
    eyebrow: "Hospitality · Commercial",
    title: "The Westlands Rooftop Restaurant",
    desc: "A vertical living plant wall framed beneath an engineered glass roof — an open-air sanctuary above the city skyline.",
  },
  {
    img: kilimaniImg,
    eyebrow: "Corporate · Fit-Out",
    title: "The Kilimani FinTech Headquarters",
    desc: "An agile, biophilic workspace pairing warm walnut joinery with charcoal architectural lines for a leading fintech.",
  },
  {
    img: karenImg,
    eyebrow: "Residential · Turnkey",
    title: "The Karen Luxury Residential Estate",
    desc: "Minimalist residential styling with bespoke custom joinery, brass railings and serene material restraint.",
  },
];

function Projects() {
  return (
    <section id="projects" className="py-28 sm:py-40">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Signature Projects</p>
            <h2 className="font-display text-4xl sm:text-6xl leading-[1]">
              A portfolio shaped by <em className="not-italic text-gold">restraint</em>, material
              honesty, and a love of light.
            </h2>
          </div>
          <div className="hairline md:w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <article
              key={p.title}
              className={`group relative overflow-hidden bg-card ${
                i === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"
              }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1280}
                  height={1600}
                  className={`w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04] ${
                    i === 0 ? "h-[420px] lg:h-[760px]" : "h-[360px]"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-90" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-bone">
                <p className="eyebrow !text-gold-soft mb-3">{p.eyebrow}</p>
                <h3 className="font-display text-2xl sm:text-3xl max-w-md">{p.title}</h3>
                <p className="mt-3 text-sm text-bone/70 max-w-md leading-relaxed">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: Sofa,
    title: "Residential Styling",
    desc: "Holistic styling for villas, apartments and estate homes — from concept boards to the final cushion.",
  },
  {
    icon: Building2,
    title: "Commercial Turnkey Fit-Outs",
    desc: "End-to-end fit-out delivery for offices, hospitality and retail. One contract, one accountable atelier.",
  },
  {
    icon: Compass,
    title: "Space Planning",
    desc: "Architectural space planning that resolves circulation, light and brand expression before a single wall is built.",
  },
];

function Services() {
  return (
    <section id="services" className="py-28 sm:py-40 bg-ink text-bone">
      <div className="container-luxe">
        <div className="max-w-2xl mb-16">
          <p className="eyebrow mb-4">The Atelier</p>
          <h2 className="font-display text-4xl sm:text-6xl leading-[1.05]">
            Three disciplines. One <em className="not-italic text-gold">uncompromising</em>{" "}
            standard.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/10">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative bg-ink p-8 sm:p-10 min-h-[300px] flex flex-col justify-between hover:bg-bone hover:text-ink transition-colors duration-500"
            >
              <s.icon
                className="size-8 text-gold group-hover:text-ink transition-colors"
                strokeWidth={1.25}
              />
              <div>
                <h3 className="font-display text-2xl sm:text-3xl mb-3">{s.title}</h3>
                <p className="text-sm leading-relaxed text-bone/70 group-hover:text-ink/70 transition-colors">
                  {s.desc}
                </p>
              </div>
              <ArrowUpRight className="absolute top-8 right-8 size-5 opacity-40 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-28 sm:py-40">
      <div className="container-luxe grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-4">About Kloche</p>
          <h2 className="font-display text-4xl sm:text-5xl leading-[1.05]">
            Designed in Westlands. Built for those who notice the{" "}
            <em className="not-italic text-gold">details</em>.
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 space-y-6 text-foreground/80 leading-relaxed">
          <p>
            Kloche Interiors is a Nairobi-based design and fit-out atelier serving affluent
            residential clients and discerning commercial developers. We curate spaces that feel
            inevitable — quiet, considered and crafted from honest materials.
          </p>
          <p>
            From a private residence in Karen to a fintech headquarters in Kilimani, every
            commission is led by a principal designer and delivered turnkey by a single accountable
            team.
          </p>
          <div className="hairline w-24 my-8" />
          <div className="grid grid-cols-3 gap-6">
            {[
              ["12+", "Years Curating"],
              ["48", "Estates Delivered"],
              ["100%", "Turnkey Delivery"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-3xl text-gold">{n}</p>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ConsultCTA() {
  return (
    <section id="consult" className="py-24 sm:py-32 bg-secondary">
      <div className="container-luxe text-center max-w-3xl">
        <p className="eyebrow mb-4">Begin a Project</p>
        <h2 className="font-display text-4xl sm:text-6xl leading-[1.05]">
          Speak with our principal designer.
        </h2>
        <p className="mt-6 text-foreground/70">
          Tap the Klo-AI consultant in the corner, or reach us directly on WhatsApp.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-ink text-bone text-xs tracking-[0.25em] uppercase px-7 py-4 rounded-sm hover:bg-gold hover:text-ink transition-colors"
          >
            <Phone className="size-4" /> WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-bone/80 pt-20 pb-10">
      <div className="container-luxe grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div>
          <p className="font-display text-3xl text-bone">Kloche Interiors</p>
          <p className="eyebrow !text-gold-soft mt-3">Luxury Interiors · Turnkey Fit-Outs</p>
        </div>
        <div>
          <p className="eyebrow !text-gold-soft mb-4">Atelier</p>
          <p className="flex items-start gap-3 text-sm leading-relaxed">
            <MapPin className="size-4 mt-1 text-gold shrink-0" />
            Karuna Road,
            <br />
            Westlands, Nairobi,
            <br />
            Kenya
          </p>
        </div>
        <div>
          <p className="eyebrow !text-gold-soft mb-4">Connect</p>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Phone className="size-4" /> +254 717 634 003
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/kloche_interiors"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 hover:text-gold transition-colors"
              >
                <Instagram className="size-4" /> @kloche_interiors
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-luxe pt-8 border-t border-bone/10 flex flex-col sm:flex-row gap-4 justify-between text-xs text-bone/50">
        <p>© {new Date().getFullYear()} Kloche Interiors. All rights reserved.</p>
        <p className="tracking-[0.2em] uppercase">Crafted in Nairobi</p>
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
        <Projects />
        <Services />
        <About />
        <ConsultCTA />
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/Landing";
import { KloAI } from "@/components/KloAI";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const TITLE = "Kloche Interiors — Luxury Interior Design in Nairobi & Westlands Fit-Outs";
const DESCRIPTION =
  "Kloche Interiors is a Nairobi atelier curating luxury interior design and premium office fit-outs in Westlands, Karen, Kilimani and across Kenya. Turnkey delivery from a single accountable team.";
const KEYWORDS =
  "luxury interior design Nairobi, interior designers Westlands, office fit-out Nairobi, commercial fit-out Westlands, residential interior design Karen, turnkey interiors Kenya, Kloche Interiors";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "InteriorDesigner",
  "@id": "/#kloche",
  name: "Kloche Interiors",
  description: DESCRIPTION,
  url: "/",
  image: "/og-image.jpg",
  telephone: "+254717634003",
  priceRange: "$$$",
  areaServed: [
    { "@type": "City", name: "Nairobi" },
    { "@type": "Place", name: "Westlands" },
    { "@type": "Place", name: "Karen" },
    { "@type": "Place", name: "Kilimani" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Karuna Road",
    addressLocality: "Westlands",
    addressRegion: "Nairobi",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.2649,
    longitude: 36.8025,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "15:00",
    },
  ],
  sameAs: [
    "https://wa.me/254717634003",
    "https://instagram.com/kloche_interiors",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Kloche Interiors Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Residential Interior Styling",
          areaServed: "Nairobi",
          description:
            "Holistic styling for villas, apartments and estate homes in Karen, Runda, Lavington and Westlands.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Commercial Turnkey Fit-Outs",
          areaServed: "Westlands, Nairobi",
          description:
            "End-to-end office, hospitality and retail fit-out delivery for developers and corporates in Nairobi.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Architectural Space Planning",
          areaServed: "Nairobi",
          description:
            "Space planning resolving circulation, light and brand expression before construction begins.",
        },
      },
    ],
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: KEYWORDS },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "KE-30" },
      { name: "geo.placename", content: "Westlands, Nairobi" },
      { name: "geo.position", content: "-1.2649;36.8025" },
      { name: "ICBM", content: "-1.2649, 36.8025" },
      { name: "author", content: "Kloche Interiors" },
      { name: "theme-color", content: "#1c1b18" },

      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:site_name", content: "Kloche Interiors" },
      { property: "og:locale", content: "en_KE" },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(localBusinessJsonLd),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Landing />
      <KloAI />
      <WhatsAppFloat />
    </>
  );
}

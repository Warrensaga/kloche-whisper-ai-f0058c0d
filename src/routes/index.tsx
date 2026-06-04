import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/Landing";
import { KloAI } from "@/components/KloAI";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kloche Interiors — Luxury Interior Design in Nairobi & Westlands Fit-Outs" },
      {
        name: "description",
        content:
          "Kloche Interiors is a Nairobi atelier curating luxury interior design and premium office fit-outs in Westlands, Karen, Kilimani and beyond.",
      },
      { property: "og:title", content: "Kloche Interiors — Luxury Interior Design in Nairobi" },
      {
        property: "og:description",
        content:
          "Turnkey luxury interiors and commercial fit-outs from our Westlands atelier on Karuna Road.",
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
    </>
  );
}

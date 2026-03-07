import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Nav } from "~/components/Nav";
import { HeroSection } from "~/components/HeroSection";
import { SutomSection } from "~/components/SutomSection";
import { AnalyzeSection } from "~/components/AnalyzeSection";
import { BlackHoleSection } from "~/components/BlackHoleSection";

export default component$(() => {
  return (
    <>
      <Nav />
      <main id="main-content">
        <HeroSection />
        <SutomSection />
        <AnalyzeSection />
        <BlackHoleSection />
      </main>
    </>
  );
});

export const head: DocumentHead = {
  title: "Portfolio BUT Informatique",
  meta: [
    {
      name: "description",
      content:
        "Portfolio SAÉ BUT Informatique — SUTOM, Analyse Statique, Simulateur Trou Noir",
    },
    { name: "theme-color", content: "#000000" },

    // ── Indexation ──────────────────────────────────────────────────────────
    // Autorise l'indexation mais bloque le suivi de liens (portfolio statique)
    { name: "robots", content: "index, follow, noarchive" },

    // ── Open Graph (partage réseaux sociaux) ────────────────────────────────
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Portfolio BUT Informatique" },
    {
      property: "og:description",
      content: "SAÉ BUT Info — SUTOM · Analyse Statique · Simulateur Trou Noir",
    },
    { property: "og:locale", content: "fr_FR" },

    // ── Sécurité supplémentaire via meta ─────────────────────────────────────
    // Désactive la détection automatique des numéros de téléphone (iOS Safari)
    { name: "format-detection", content: "telephone=no" },
  ],
};

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <main
      class="min-h-screen bg-black flex items-center justify-center px-8"
      aria-label="Page introuvable"
    >
      <div class="text-center">
        <p class="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-white/25 mb-4">
          Erreur
        </p>
        <h1 class="font-display font-extrabold text-white text-6xl mb-4">
          404
        </h1>
        <p class="text-white/40 text-sm mb-8">Cette page n'existe pas.</p>
        <a
          href="/"
          class="font-mono text-[0.65rem] tracking-wider uppercase text-white/50 border border-white/15 px-4 py-2 rounded hover:text-white/80 hover:border-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          Retour à l'accueil
        </a>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "404 — Page introuvable",
  meta: [
    // Ne pas indexer les pages d'erreur
    { name: "robots", content: "noindex, nofollow" },
  ],
};

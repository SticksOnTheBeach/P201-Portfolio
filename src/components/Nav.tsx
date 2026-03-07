import { component$ } from "@builder.io/qwik";

const NAV_LINKS = [
  { label: "Accueil", href: "#hero" },
  { label: "SUTOM", href: "#sutom" },
  { label: "Analyse statique", href: "#analyze" },
  { label: "Trou Noir", href: "#blackhole" },
] as const;

export const Nav = component$(() => {
  return (
    <>
      {/*
        Lien d'évitement (skip-to-content) — accessibilité & sécurité :
        permet aux lecteurs d'écran et aux crawlers de sauter la nav.
        Visible uniquement au focus clavier.
      */}
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:font-mono focus:text-sm"
      >
        Aller au contenu principal
      </a>

      <nav
        aria-label="Navigation principale"
        class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-6"
      >
        <span
          class="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/30"
          aria-label="Portfolio BUT Informatique"
        >
          Portfolio · BUT Info
        </span>

        <ul class="hidden md:flex gap-10 list-none" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {/*
                Les href sont des ancres internes (#id) — pas de risque
                d'injection d'URL externe. La liste est statique (const).
              */}
              <a
                href={link.href}
                class="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-white/25 hover:text-white/70 transition-colors duration-300 focus:outline-none focus:text-white/80 focus:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
});

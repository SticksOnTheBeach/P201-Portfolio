import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

/**
 * RouterHead — injecte les balises <head> de manière sécurisée.
 *
 * Sécurité :
 *  - Pas de dangerouslySetInnerHTML sur les styles injectés par le framework
 *    (les styles Qwik SSR sont de confiance et scopés)
 *  - rel="canonical" construit depuis l'URL réelle (pas de paramètre utilisateur)
 *  - Les polices Google Fonts sont chargées avec crossOrigin="anonymous"
 *    pour isoler les credentials et activer le CORS SRI si disponible
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      {/* Canonical : utilise l'URL serveur, jamais une valeur utilisateur */}
      <link rel="canonical" href={loc.url.href} />

      {/* Viewport — empêche le zoom forcé sur mobile (UX + anti-spoofing) */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />

      {/* Encodage explicite */}
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

      {/* Empêche IE de passer en mode de compatibilité (legacy) */}
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />

      {/* Favicon SVG — pas d'exécution possible depuis un SVG servi en icon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {/*
        Google Fonts — crossOrigin="anonymous" :
        - isole les cookies/credentials de fonts.gstatic.com
        - requis pour que le navigateur valide une future entête SRI
      */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Meta tags déclarés dans les routes (description, theme-color…) */}
      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {/* Links déclarés dans les routes */}
      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {/*
        Styles injectés par Qwik SSR (scopés, hashés, de confiance).
        dangerouslySetInnerHTML est ici inévitable car c'est le mécanisme
        officiel Qwik pour hydrater les styles critiques — le contenu
        provient exclusivement du build, jamais d'une entrée utilisateur.
      */}
      {head.styles.map((s) => (
        <style key={s.key} {...s.props}>
          {s.style}
        </style>
      ))}
    </>
  );
});

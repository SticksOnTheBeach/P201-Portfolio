import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Security headers applied on every response.
 *
 * Content-Security-Policy breakdown:
 *  - default-src 'self'          → bloc tout par défaut sauf même origine
 *  - script-src  'self'          → pas d'inline scripts, pas d'eval
 *  - style-src   'self' 'unsafe-inline' fonts.googleapis.com
 *                                → Tailwind génère des styles inline côté SSR ;
 *                                  à remplacer par un hash une fois en prod stable
 *  - font-src    fonts.gstatic.com → Google Fonts uniquement
 *  - img-src     'self' data:    → images locales + data: URI (canvas toDataURL)
 *  - connect-src 'self'          → pas de requêtes XHR/fetch vers l'extérieur
 *  - frame-ancestors 'none'      → anti-clickjacking (équivaut X-Frame-Options: DENY)
 *  - base-uri    'self'          → empêche injection de <base href>
 *  - form-action 'self'          → pas de soumission vers des tiers
 *  - object-src  'none'          → pas de Flash / plugins
 *  - upgrade-insecure-requests   → force HTTPS en prod
 */
const SECURITY_HEADERS: Record<string, string> = {
  // ── Clickjacking ──────────────────────────────────────────────────────────
  "X-Frame-Options": "DENY",

  // ── MIME-type sniffing ────────────────────────────────────────────────────
  "X-Content-Type-Options": "nosniff",

  // ── Referrer ─────────────────────────────────────────────────────────────
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // ── Permissions (caméra, micro, géoloc…) ─────────────────────────────────
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",

  // ── XSS filter (legacy browsers) ─────────────────────────────────────────
  "X-XSS-Protection": "1; mode=block",

  // ── HSTS (activer uniquement si le domaine est 100 % HTTPS) ──────────────
  // Décommenté en prod : "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

  // ── Content Security Policy ───────────────────────────────────────────────
  "Content-Security-Policy": [
    "default-src 'self'",
    // Qwik injecte des scripts inline signés via nonce en SSR ;
    // 'unsafe-inline' est acceptable en dev, à remplacer par nonce en prod
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    // data: nécessaire pour les canvas (toDataURL) et les images base64
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
};

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],

    // ── Dev server ────────────────────────────────────────────────────────
    server: {
      headers: {
        ...SECURITY_HEADERS,
        "Cache-Control": "no-store",
      },
    },

    // ── Preview / production ──────────────────────────────────────────────
    preview: {
      headers: {
        ...SECURITY_HEADERS,
        // Assets immutables (hachés par Vite) : cache long
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },

    build: {
      // Empêche de leaker les sources en production
      sourcemap: false,
      // Taille limite d'un chunk avant avertissement (200 ko)
      chunkSizeWarningLimit: 200,
    },
  };
});

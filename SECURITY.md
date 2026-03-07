# Politique de sécurité

## Mesures implémentées

### Headers HTTP
Tous les headers de sécurité sont définis dans `vite.config.ts` :

| Header | Valeur | Protection |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'` + règles strictes | XSS, injection, data exfil |
| `X-Frame-Options` | `DENY` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Fuite d'URL |
| `Permissions-Policy` | camera, micro, géoloc désactivés | API sensibles |
| `X-XSS-Protection` | `1; mode=block` | Navigateurs legacy |

### TypeScript
- Mode `strict` complet (`noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`…)
- `isolatedModules: true` — chaque fichier est compilable indépendamment

### Liens externes
- Tous les liens `target="_blank"` ont `rel="noopener noreferrer"`
- Empêche l'accès à `window.opener` depuis la page cible

### Ressources
- Images servies depuis `/public` (origine locale)
- Polices Google chargées avec `crossOrigin="anonymous"`
- `loading="lazy"` + `decoding="async"` sur les images non critiques
- Source maps désactivées en production (`sourcemap: false`)

### Canvas / JavaScript
- Chaque `requestAnimationFrame` est annulé via `cleanup()` de Qwik
- Les event listeners `resize` sont retirés à l'unmount (`passive: true`)
- Pas d'`eval()`, pas de `innerHTML`, pas de `document.write`

### Variables d'environnement
- `.env` exclu du dépôt via `.gitignore`
- `.env.example` fourni sans aucune valeur sensible
- Préfixe `PUBLIC_` requis pour exposer des variables côté client

### Accessibilité & sécurité
- Lien skip-to-content pour éviter le piégeage du focus
- `aria-hidden="true"` sur les éléments décoratifs (canvas, divs d'overlay)
- `aria-label` sur les liens externes précisant l'ouverture en nouvel onglet

## Pour activer HSTS en production
Décommenter dans `vite.config.ts` :
```
"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
```
**Uniquement** si le domaine est 100 % HTTPS et ne reviendra jamais en HTTP.

## Signaler une vulnérabilité
Ouvrir une issue privée sur le dépôt GitHub.

import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        {/* charset doit être dans les 1024 premiers octets */}
        <meta charset="utf-8" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="fr">
        {/* Pas de contenu inline ici : tout passe par RouterOutlet */}
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});

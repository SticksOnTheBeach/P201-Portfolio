import { component$ } from "@builder.io/qwik";
import { AcItem, Tag, SkillChip } from "./ui";

export const BlackHoleSection = component$(() => {
  return (
    <section
      id="blackhole"
      class="slide relative h-screen w-full flex items-center overflow-hidden"
    >
      {/* Image  trou noir en fond ; aria-hidden car purement décoratif */}
      <div
        aria-hidden="true"
        class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          // Pas de contenu utilisateur → pas de risque d'injection CSS
          backgroundImage: "url('/blackhole.png')",
          backgroundPosition: "center right",
        }}
      />

      <div
        class="absolute inset-0 z-10"
        style="background: linear-gradient(to right, rgba(0,0,0,0.93) 42%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.05) 100%);"
      />

      <div
        class="absolute right-0 top-0 h-full z-20 hidden md:flex items-center justify-end pr-10 lg:pr-20"
        style="width: 46%;"
      >
        <img
          src="/QT_Logo.png"
          alt="Capture d'écran du jeu SUTOM sur téléphone mobile montrant une partie en cours"
          // loading="lazy" → ne charge l'image que quand elle est proche du viewport
          loading="lazy"
          // decoding="async" → décode l'image hors du thread principal
          decoding="async"
          width={420}
          height={860}
          class="h-[40vh] max-h-[200px] w-auto object-contain select-none phone-float opacity-70"
          style="filter: drop-shadow(0 40px 80px rgba(0,0,0,0.5)) drop-shadow(0 8px 24px rgba(0,0,0,0.3));"
          draggable={false}
        />
      </div>

      {/* Content */}
      <div class="relative z-20 max-w-lg px-12 md:px-20 flex flex-col gap-5">
        <p class="font-mono text-[0.62rem] tracking-[0.3em] uppercase text-amber-300/60">
          03 / 03 — Simulation physique
        </p>

        <div class="flex flex-wrap gap-2">
          <Tag color="warm">C++ / Qt</Tag>
          <Tag color="warm">Gravitation</Tag>
          <Tag color="warm">Interface graphique</Tag>
        </div>

        <h2
          class="font-display font-extrabold text-white leading-[1.05] tracking-tight"
          style="font-size: clamp(2rem, 4vw, 3.4rem);"
        >
          Simulateur<br />
          Trou Noir
        </h2>

        <p class="text-[0.92rem] text-white/50 leading-relaxed max-w-md">
          Simulation gravitationnelle d'un trou noir avec calculs physiques
          réels — loi de Newton, intégration RK4, trajectoires orbitales.
          Interface Qt en C++ avec rendu temps réel.
        </p>

        {/* Block formules physiques */}
        <div class="font-mono text-[0.68rem] text-amber-300/40 leading-[2.2] bg-black/35 px-4 py-3 rounded border-l-2 border-amber-500/20">
          F = G·m₁·m₂ / r²{"  "}·{"  "}Gravitation de Newton
          <br />
          Intégration Runge-Kutta d'ordre 4
          <br />
          Horizon d'événements &amp; disque d'accrétion
        </div>

        <div class="flex flex-col gap-2.5">
          <AcItem
            code="AC11.01"
            color="warm"
            desc="Implémenter les équations différentielles de gravité en C++ avec rendu Qt"
          />
          <AcItem
            code="AC12.02"
            color="warm"
            desc="Optimiser les calculs N-corps — complexité O(n²) et approximations spatiales"
          />
          <AcItem
            code="AC11.02"
            color="warm"
            desc="Concevoir l'architecture MVC : simulation découplée du rendu graphique Qt"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <SkillChip>C++20</SkillChip>
          <SkillChip>Qt6</SkillChip>
          <SkillChip>Physique numérique</SkillChip>
          <SkillChip>MVC</SkillChip>
        </div>
      </div>
    </section>
  );
});

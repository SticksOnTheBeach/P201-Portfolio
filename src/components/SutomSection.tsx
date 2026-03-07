import { component$ } from "@builder.io/qwik";
import { AcItem, Tag, SkillChip } from "./ui";

const GRID: Array<{ char: string; type: "g" | "y" | "r" | "e" }[]> = [
  [
    { char: "S", type: "g" },
    { char: "A", type: "r" },
    { char: "T", type: "y" },
    { char: "I", type: "r" },
    { char: "O", type: "g" },
    { char: "N", type: "r" },
  ],
  [
    { char: "S", type: "g" },
    { char: "O", type: "g" },
    { char: "U", type: "r" },
    { char: "R", type: "g" },
    { char: "C", type: "r" },
    { char: "E", type: "g" },
  ],
  [
    { char: "S", type: "g" },
    { char: "O", type: "g" },
    { char: "R", type: "g" },
    { char: "T", type: "g" },
    { char: "I", type: "g" },
    { char: "E", type: "g" },
  ],
  [
    { char: "", type: "e" },
    { char: "", type: "e" },
    { char: "", type: "e" },
    { char: "", type: "e" },
    { char: "", type: "e" },
    { char: "", type: "e" },
  ],
];

const cellClass: Record<string, string> = {
  g: "cell-green",
  y: "cell-yellow",
  r: "cell-red",
  e: "cell-empty",
};

export const SutomSection = component$(() => {
  return (
    <section
      id="sutom"
      class="slide relative h-screen w-full flex items-center overflow-hidden"
    >
      
      <div
        class="absolute inset-0 z-0"
        style="background: linear-gradient(to bottom, #0e1f3d 0%, #0a1628 35%, #060e1c 65%, #000000 100%);"
      />

      {/* Left side: text content */}
      <div class="relative z-20 w-full h-full flex items-center">
        <div class="max-w-[520px] px-12 md:px-20 flex flex-col gap-5">
          <p class="font-mono text-[0.62rem] tracking-[0.3em] uppercase text-blue-300/60">
            01 / 03 — SAÉ 1.01
          </p>

          <div class="flex flex-wrap gap-2">
            <Tag color="green">Python</Tag>
            <Tag color="green">Jeu de mots</Tag>
            <Tag color="green">Besoin client</Tag>
          </div>

          <h2
            class="font-display font-extrabold leading-[1.05] tracking-tight text-white"
            style="font-size: clamp(2rem, 4vw, 3.4rem);"
          >
            Jeu SUTOM
          </h2>

          <p class="text-[0.92rem] text-white/50 leading-relaxed max-w-md">
            Recréation du jeu MOTUS / SUTOM en Python. Le joueur dispose de 6
            essais pour deviner un mot — la première lettre est révélée. Chaque
            lettre est colorée selon sa justesse.
          </p>

          {/* Mini SUTOM grid */}
          <div
            class="grid gap-[3px]"
            style="grid-template-columns: repeat(6, 32px);"
          >
            {GRID.flat().map((cell, i) => (
              <div
                key={i}
                class={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-[0.78rem] ${cellClass[cell.type]}`}
              >
                {cell.char}
              </div>
            ))}
          </div>

          {/* AC badges */}
          <div class="flex flex-col gap-2.5">
            <AcItem
              code="AC11.01"
              color="green"
              desc="Implémenter la logique du jeu — vérification des lettres, gestion des essais en Python"
            />
            <AcItem
              code="AC11.02"
              color="green"
              desc="Concevoir la structure : fonctions, gestion d'état, dictionnaire de mots"
            />
            <AcItem
              code="AC15.01"
              color="green"
              desc="Analyser le besoin client (règles SUTOM) et le formaliser en spécifications"
            />
          </div>

          <div class="flex flex-wrap gap-2">
            <SkillChip>Python</SkillChip>
            <SkillChip>Algorithmique</SkillChip>
            <SkillChip>Structures de données</SkillChip>
            <SkillChip>Tests unitaires</SkillChip>
          </div>
        </div>
      </div>

      {/* Right side: phone mockup — floats to the right, slightly tilted */}
      <div
        class="absolute right-0 top-0 h-full z-20 hidden md:flex items-center justify-end pr-10 lg:pr-20"
        style="width: 46%;"
      >
        <img
          src="/SUTOM.png"
          alt="Capture d'écran du jeu SUTOM sur téléphone mobile montrant une partie en cours"
          // loading="lazy" → ne charge l'image que quand elle est proche du viewport
          loading="lazy"
          // decoding="async" → décode l'image hors du thread principal
          decoding="async"
          width={420}
          height={860}
          class="h-[86vh] max-h-[800px] w-auto object-contain select-none phone-float"
          style="filter: drop-shadow(0 40px 80px rgba(0,0,0,0.5)) drop-shadow(0 8px 24px rgba(0,0,0,0.3));"
          draggable={false}
        />
      </div>

      {/* Bottom fade overlay — smooth transition into the next dark slide */}
      <div
        class="absolute bottom-0 left-0 right-0 z-30 h-28 pointer-events-none"
        style="background: linear-gradient(to bottom, transparent, #000);"
      />
    </section>
  );
});

import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { AcItem, Tag, SkillChip } from "./ui";

interface AstNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
}

const AST_LABELS = [
  "fn", "if", "for", "{}", "()", "=>", "var", "int", "ptr", "class", "::",
] as const;

export const AnalyzeSection = component$(() => {
  useVisibleTask$(({ cleanup }) => {
    const canvas = document.getElementById("bg-analyze") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let nodes: AstNode[] = [];
    let rafId = 0;

    const resize = (): void => {
      W = canvas.width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
      H = canvas.height = canvas.parentElement?.offsetHeight ?? window.innerHeight;
    };

    const init = (): void => {
      nodes = Array.from({ length: 38 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        label: AST_LABELS[Math.floor(Math.random() * AST_LABELS.length)] ?? "fn",
      }));
    };

    const draw = (): void => {
      ctx.fillStyle = "rgba(2,10,24,0.18)";
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!a) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (!b) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(59,130,246,${(0.07 * (1 - d / 130)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.45)";
        ctx.fill();

        ctx.font = "9px 'Space Mono',monospace";
        ctx.fillStyle = "rgba(96,165,250,0.3)";
        ctx.fillText(n.label, n.x + 5, n.y - 4);
      }

      rafId = requestAnimationFrame(draw);
    };

    const onResize = (): void => { resize(); init(); };

    ctx.fillStyle = "#02040f";
    ctx.fillRect(0, 0, W || 1, H || 1);
    resize();
    init();
    draw();

    window.addEventListener("resize", onResize, { passive: true });
    cleanup(() => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    });
  });

  return (
    <section
      id="analyze"
      aria-label="Projet Analyseur Statique de Code"
      class="slide relative h-screen w-full flex items-center overflow-hidden"
    >
      {/* Animated AST background */}
      <canvas
        id="bg-analyze"
        aria-hidden="true"
        role="presentation"
        class="absolute inset-0 w-full h-full z-0"
      />
      <div class="slide-overlay absolute inset-0 z-10" aria-hidden="true" />

      {/* Right: Terminal image — cliquable envoie vers -- page interactive Tree-sitter */}
      <div
        class="absolute right-0 top-0 h-full z-20 hidden md:flex items-center justify-end pr-10 lg:pr-20"
        style="width: 46%;"
      >
        <div class="phone-float [perspective:1000px]">
          <a
            href="/tree-sitter"
            aria-label="Ouvrir la visualisation interactive Tree-sitter"
            class="block focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-xl"
          >
            <img
              src="/Terminal.png"
              alt="Terminal représentant l'analyseur de code — cliquer pour la démo interactive"
              loading="lazy"
              decoding="async"
              width={480}
              height={400}
              class="h-[50vh] max-h-[400px] w-auto object-contain select-none drop-shadow-2xl cursor-pointer transition-all duration-500 ease-out hover:[transform:rotateX(8deg)_rotateY(-15deg)_scale(1.05)]"
              draggable={false}
            />
            {/* Overlay hint */}
            <div class="absolute inset-0 flex items-end justify-center pb-4 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span class="font-mono text-[0.58rem] tracking-widest uppercase text-blue-300 bg-black/70 px-3 py-1.5 rounded-full border border-blue-500/30 backdrop-blur-sm">
                Voir la démo →
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Left: text content */}
      <div class="relative z-20 max-w-lg px-12 md:px-20 flex flex-col gap-5">
        <p class="font-mono text-[0.62rem] tracking-[0.3em] uppercase text-blue-400/60">
          02 / 03 — Analyse statique
        </p>

        <div class="flex flex-wrap gap-2">
          <Tag color="blue">Tree-sitter</Tag>
          <Tag color="blue">C++</Tag>
          <Tag color="blue">AST</Tag>
        </div>

        <h2
          class="font-display font-extrabold text-white leading-[1.05] tracking-tight"
          style="font-size: clamp(2rem, 4vw, 3.4rem);"
        >
          Analyseur Statique<br />
          <span class="text-white/40">de Code</span>
        </h2>

        <p class="text-[0.92rem] text-white/50 leading-relaxed max-w-md">
          Outil d'analyse statique de code C++ utilisant Tree-sitter pour
          parcourir l'arbre syntaxique abstrait et détecter erreurs, mauvaises
          pratiques et violations de style.
        </p>

        <div class="font-mono text-[0.68rem] text-blue-400/40 leading-[2.2] bg-black/30 px-4 py-3 rounded border-l-2 border-blue-500/20">
          <span class="text-blue-400/60">src/</span>{"  "}— logique d'analyse &amp; règles<br />
          <span class="text-blue-400/60">include/</span>{"  "}— interfaces &amp; types<br />
          <span class="text-blue-400/60">build/</span>{"  "}— artefacts compilés<br />
          <span class="text-blue-400/60">tree-sitter</span>{"  "}— parsing AST
        </div>

        <div class="flex flex-col gap-2.5">
          <AcItem
            code="AC12.01"
            color="blue"
            desc="Analyser un problème avec méthode — décomposition en règles d'analyse indépendantes"
          />
          <AcItem
            code="AC12.02"
            color="blue"
            desc="Comparer les approches — complexité du parcours AST, couverture des patterns"
          />
          <AcItem
            code="AC11.03"
            color="blue"
            desc="Valider l'outil sur des cas de test — mesure des vrais et faux positifs"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <SkillChip>Tree-sitter</SkillChip>
          <SkillChip>C++</SkillChip>
          <SkillChip>AST</SkillChip>
          <SkillChip>CMake</SkillChip>
          <SkillChip>Qualité logicielle</SkillChip>
        </div>

        <div class="flex gap-3 flex-wrap">
          <a
            href="/tree-sitter"
            aria-label="Ouvrir la démo interactive Tree-sitter"
            class="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-wider uppercase text-blue-300 border border-blue-400/40 px-4 py-2 rounded hover:bg-blue-500/10 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            ▶ Démo interactive
          </a>
          <a
            href="https://github.com/SticksOnTheBeach/AnalyzeStaticCode2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Voir le code source sur GitHub (s'ouvre dans un nouvel onglet)"
            class="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-wider uppercase text-blue-400 border border-blue-500/30 px-4 py-2 rounded hover:bg-blue-500/8 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
});

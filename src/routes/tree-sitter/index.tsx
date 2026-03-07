import { component$, useStore, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

// ── Types ──────────────────────────────────────────────────────────────────────

type NodeStatus = "idle" | "visiting" | "ok" | "error" | "warning";

interface ASTNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  status: NodeStatus;
  children: string[];
  rule?: string;
  errorMsg?: string;
}

interface AnimStep {
  nodeId: string;
  status: NodeStatus;
  message: string;
  errorMsg?: string;
  delay: number;
}

// ── AST Graphe -- représente l'analyse d'une fonction C++ ──────────────────

const AST_NODES: ASTNode[] = [
  // Root
  { id: "root",      label: "translation_unit",  type: "root",        x: 50,  y: 8,  status: "idle", children: ["func"] },
  // Function
  { id: "func",      label: "function_def",       type: "function",    x: 50,  y: 20, status: "idle", children: ["ret", "name", "params", "body"] },
  // Function parts
  { id: "ret",       label: "int",                type: "type",        x: 12,  y: 34, status: "idle", children: [] },
  { id: "name",      label: "compute()",          type: "identifier",  x: 32,  y: 34, status: "idle", children: [] },
  { id: "params",    label: "params",             type: "params",      x: 52,  y: 34, status: "idle", children: ["p1", "p2"] },
  { id: "body",      label: "compound_stmt",      type: "body",        x: 76,  y: 34, status: "idle", children: ["decl", "loop", "ret_stmt"] },
  // Params
  { id: "p1",        label: "int n",              type: "param",       x: 42,  y: 48, status: "idle", children: [] },
  { id: "p2",        label: "int* arr",           type: "param",       x: 62,  y: 48, status: "idle", children: [] },
  // Body children
  { id: "decl",      label: "int sum = 0",        type: "declaration", x: 60,  y: 48, status: "idle", children: [] },
  { id: "loop",      label: "for(...)",           type: "for_loop",    x: 76,  y: 48, status: "idle", children: ["init", "cond", "inc", "loop_body"] },
  { id: "ret_stmt",  label: "return sum",         type: "return",      x: 90,  y: 48, status: "idle", children: [] },
  // Loop parts
  { id: "init",      label: "i = 0",             type: "expr",        x: 60,  y: 64, status: "idle", children: [] },
  { id: "cond",      label: "i < n",             type: "expr",        x: 72,  y: 64, status: "idle", children: [] },
  { id: "inc",       label: "i++",               type: "expr",        x: 84,  y: 64, status: "idle", children: [] },
  { id: "loop_body", label: "sum += arr[i]",     type: "expr",        x: 76,  y: 76, status: "idle", children: [] },
];

// Animation steps : visite DFS + détection de règles
const ANIM_STEPS: AnimStep[] = [
  { nodeId: "root",      status: "visiting", message: "📂 Début de l'analyse — parcours DFS de l'AST", delay: 0 },
  { nodeId: "root",      status: "ok",       message: "✅ translation_unit valide", delay: 700 },
  { nodeId: "func",      status: "visiting", message: "🔍 Visite : function_definition", delay: 1400 },
  { nodeId: "func",      status: "ok",       message: "✅ Définition de fonction détectée", delay: 2000 },
  { nodeId: "ret",       status: "visiting", message: "🔍 Vérification du type de retour…", delay: 2600 },
  { nodeId: "ret",       status: "ok",       message: "✅ Type de retour explicite : int", delay: 3200 },
  { nodeId: "name",      status: "visiting", message: "🔍 Lecture de l'identifiant…", delay: 3800 },
  { nodeId: "name",      status: "ok",       message: "✅ Nom valide : compute()", delay: 4300 },
  { nodeId: "params",    status: "visiting", message: "🔍 Analyse des paramètres…", delay: 4900 },
  { nodeId: "p1",        status: "visiting", message: "🔍 Paramètre 1…", delay: 5400 },
  { nodeId: "p1",        status: "ok",       message: "✅ int n — type explicite ✓", delay: 5900 },
  { nodeId: "p2",        status: "visiting", message: "🔍 Paramètre 2 — pointeur détecté…", delay: 6400 },
  {
    nodeId: "p2", status: "warning",
    message: "⚠️ Pointeur brut détecté",
    errorMsg: "AC12.01 — Règle PTR001 : préférer std::span<int> ou const std::vector<int>& à int*",
    delay: 7000,
  },
  { nodeId: "params",    status: "warning",  message: "⚠️ Paramètres : 1 avertissement", delay: 7500 },
  { nodeId: "body",      status: "visiting", message: "🔍 Analyse du corps de la fonction…", delay: 8100 },
  { nodeId: "decl",      status: "visiting", message: "🔍 Déclaration de variable…", delay: 8600 },
  { nodeId: "decl",      status: "ok",       message: "✅ int sum = 0 — initialisé ✓", delay: 9100 },
  { nodeId: "loop",      status: "visiting", message: "🔍 Boucle for — vérification de complexité…", delay: 9700 },
  { nodeId: "init",      status: "visiting", message: "🔍 Initialisation de la boucle…", delay: 10200 },
  { nodeId: "init",      status: "ok",       message: "✅ i = 0 ✓", delay: 10600 },
  { nodeId: "cond",      status: "visiting", message: "🔍 Condition d'arrêt…", delay: 11100 },
  { nodeId: "cond",      status: "ok",       message: "✅ i < n — borne correcte", delay: 11600 },
  { nodeId: "inc",       status: "visiting", message: "🔍 Incrément…", delay: 12100 },
  { nodeId: "inc",       status: "ok",       message: "✅ i++ ✓", delay: 12500 },
  { nodeId: "loop_body", status: "visiting", message: "🔍 Corps de boucle — accès tableau…", delay: 13000 },
  {
    nodeId: "loop_body", status: "error",
    message: "❌ Accès tableau sans vérification de bornes",
    errorMsg: "AC11.03 — Règle ARR002 : arr[i] sans bounds-check. Utiliser arr.at(i) ou vérifier i < size()",
    delay: 13700,
  },
  { nodeId: "loop",      status: "error",    message: "❌ Boucle : 1 erreur critique", delay: 14300 },
  { nodeId: "ret_stmt",  status: "visiting", message: "🔍 Instruction return…", delay: 14900 },
  { nodeId: "ret_stmt",  status: "ok",       message: "✅ return sum — valeur retournée ✓", delay: 15400 },
  { nodeId: "body",      status: "error",    message: "❌ Corps : 1 erreur, 0 avertissements", delay: 16000 },
  { nodeId: "func",      status: "error",    message: "❌ Analyse terminée — 1 erreur, 1 avertissement", delay: 16600 },
];

// ── Couleurs par statut ──────────────────────────────────────────────────────
const STATUS_COLORS: Record<NodeStatus, { fill: string; stroke: string; text: string }> = {
  idle:     { fill: "rgba(255,255,255,0.04)", stroke: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.4)" },
  visiting: { fill: "rgba(251,191,36,0.15)",  stroke: "#fbbf24",               text: "#fbbf24" },
  ok:       { fill: "rgba(34,197,94,0.15)",   stroke: "#22c55e",               text: "#4ade80" },
  error:    { fill: "rgba(239,68,68,0.18)",   stroke: "#ef4444",               text: "#f87171" },
  warning:  { fill: "rgba(251,146,60,0.15)",  stroke: "#fb923c",               text: "#fdba74" },
};

const TYPE_COLORS: Record<string, string> = {
  root:        "#a78bfa",
  function:    "#60a5fa",
  type:        "#34d399",
  identifier:  "#60a5fa",
  params:      "#f472b6",
  param:       "#f472b6",
  body:        "#60a5fa",
  declaration: "#34d399",
  for_loop:    "#fb923c",
  return:      "#a78bfa",
  expr:        "#94a3b8",
};

// ── Composant principal ────────────────────────────────────────────────────────
export default component$(() => {
  const state = useStore({
    nodes: AST_NODES.map((n) => ({ ...n })) as ASTNode[],
    currentMessage: "Cliquez sur « Lancer l'analyse » pour démarrer la simulation Tree-sitter",
    currentError: "" as string,
    isRunning: false,
    isDone: false,
    stepIndex: 0,
    visitedCount: 0,
    errorCount: 0,
    warningCount: 0,
  });

  // ── Canvas drawing ──────────────────────────────────────────────────────────
  useVisibleTask$(({ track }) => {
    track(() => state.nodes.map((n) => n.status).join(","));

    const canvas = document.getElementById("ast-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, W, H);

    const toX = (pct: number) => (pct / 100) * W;
    const toY = (pct: number) => (pct / 100) * H;

    const nodeMap = new Map(state.nodes.map((n) => [n.id, n]));

    // Draw edges first
    for (const node of state.nodes) {
      const parentC = STATUS_COLORS[node.status];
      for (const childId of node.children) {
        const child = nodeMap.get(childId);
        if (!child) continue;
        const childC = STATUS_COLORS[child.status];

        const x1 = toX(node.x);
        const y1 = toY(node.y);
        const x2 = toX(child.x);
        const y2 = toY(child.y);

        // Gradient edge
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, parentC.stroke.replace(")", ",0.5)").replace("rgb", "rgba").replace("#", "rgba(") || "rgba(255,255,255,0.2)");
        grad.addColorStop(1, childC.stroke.replace(")", ",0.5)").replace("rgb", "rgba").replace("#", "rgba(") || "rgba(255,255,255,0.2)");

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = node.status === "idle" && child.status === "idle"
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.25)";
        ctx.lineWidth = node.status !== "idle" || child.status !== "idle" ? 1.5 : 1;
        ctx.stroke();

        // Arrowhead
        if (node.status !== "idle" || child.status !== "idle") {
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const aLen = 7;
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - aLen * Math.cos(angle - 0.4), y2 - aLen * Math.sin(angle - 0.4));
          ctx.lineTo(x2 - aLen * Math.cos(angle + 0.4), y2 - aLen * Math.sin(angle + 0.4));
          ctx.closePath();
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.fill();
        }
      }
    }

    // Draw nodes
    for (const node of state.nodes) {
      const cx = toX(node.x);
      const cy = toY(node.y);
      const c = STATUS_COLORS[node.status];
      const typeColor = TYPE_COLORS[node.type] ?? "#94a3b8";
      const isActive = node.status === "visiting";

      // Glow for active node
      if (isActive) {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 38);
        glow.addColorStop(0, "rgba(251,191,36,0.18)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node pill background
      const labelW = Math.max(node.label.length * 6.2 + 20, 52);
      const labelH = 24;
      const rx = cx - labelW / 2;
      const ry = cy - labelH / 2;

      ctx.beginPath();
      ctx.roundRect(rx, ry, labelW, labelH, 6);
      ctx.fillStyle = c.fill;
      ctx.fill();
      ctx.strokeStyle = c.stroke;
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();

      // Type color dot
      ctx.beginPath();
      ctx.arc(rx + 9, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = typeColor;
      ctx.fill();

      // Label text
      ctx.font = `${isActive ? "bold " : ""}9px 'Space Mono', monospace`;
      ctx.fillStyle = c.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, cx + 4, cy);
      ctx.textAlign = "left";
    }
  });

  // ── Animation runner ────────────────────────────────────────────────────────
  const runAnalysis = $(async () => {
    if (state.isRunning) return;

    // Reset
    state.nodes = AST_NODES.map((n) => ({ ...n }));
    state.isRunning = true;
    state.isDone = false;
    state.stepIndex = 0;
    state.currentMessage = "🚀 Tree-sitter — démarrage du parcours DFS…";
    state.currentError = "";
    state.visitedCount = 0;
    state.errorCount = 0;
    state.warningCount = 0;

    for (let i = 0; i < ANIM_STEPS.length; i++) {
      const step = ANIM_STEPS[i];
      if (!step) continue;

      await new Promise<void>((resolve) => {
        const prevDelay = i === 0 ? 0 : (ANIM_STEPS[i - 1]?.delay ?? 0);
        const delta = step.delay - prevDelay;
        setTimeout(resolve, delta > 0 ? delta : 50);
      });

      // Update node status
      const nodeIdx = state.nodes.findIndex((n) => n.id === step.nodeId);
      if (nodeIdx !== -1) {
        state.nodes = state.nodes.map((n, idx) =>
          idx === nodeIdx ? { ...n, status: step.status, errorMsg: step.errorMsg } : n
        );
      }

      state.stepIndex = i;
      state.currentMessage = step.message;
      state.currentError = step.errorMsg ?? "";

      if (step.status === "ok") state.visitedCount++;
      if (step.status === "error") state.errorCount++;
      if (step.status === "warning") state.warningCount++;
    }

    state.isRunning = false;
    state.isDone = true;
  });

  const resetAnalysis = $(() => {
    state.nodes = AST_NODES.map((n) => ({ ...n }));
    state.isRunning = false;
    state.isDone = false;
    state.stepIndex = 0;
    state.currentMessage = "Cliquez sur « Lancer l'analyse » pour démarrer la simulation Tree-sitter";
    state.currentError = "";
    state.visitedCount = 0;
    state.errorCount = 0;
    state.warningCount = 0;
  });

  return (
    <div class="min-h-screen bg-[#02040f] text-white font-body flex flex-col">

      {/* ── Header ── */}
      <header class="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div class="flex items-center gap-4">
          <a
            href="/"
            rel="noopener noreferrer"
            aria-label="Retour au portfolio"
            class="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-white/25 hover:text-white/60 transition-colors focus:outline-none focus:underline"
          >
            ← Portfolio
          </a>
          <span class="text-white/10">|</span>
          <span class="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-blue-400/60">
            AnalyzeStaticCode2
          </span>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-mono text-[0.58rem] text-white/20 uppercase tracking-wider">
            Simulation Tree-sitter
          </span>
          <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
        </div>
      </header>

      {/* ── Main layout ── */}
      <main class="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

        {/* ── LEFT: Code source + controls ── */}
        <aside class="lg:w-[340px] shrink-0 border-r border-white/5 flex flex-col">

          {/* Code snippet */}
          <div class="p-5 border-b border-white/5">
            <p class="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-white/25 mb-3">
              Code analysé (C++)
            </p>
            <pre class="font-mono text-[0.72rem] leading-[1.8] text-white/60 overflow-x-auto bg-white/[0.02] rounded-lg p-4 border border-white/5">
{`int compute(int n, int* arr) {
  int sum = 0;
  for (int i = 0; i < n; i++) {
    sum += arr[i]; // ← danger
  }
  return sum;
}`}
            </pre>
          </div>

          {/* Legend */}
          <div class="p-5 border-b border-white/5 flex flex-col gap-2">
            <p class="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-white/25 mb-1">
              Légende
            </p>
            {(
              [
                { status: "idle",     label: "Non visité" },
                { status: "visiting", label: "En cours d'analyse" },
                { status: "ok",       label: "Validé" },
                { status: "warning",  label: "Avertissement" },
                { status: "error",    label: "Erreur critique" },
              ] as { status: NodeStatus; label: string }[]
            ).map(({ status, label }) => (
              <div key={status} class="flex items-center gap-2.5">
                <div
                  class="w-3 h-3 rounded-sm border shrink-0"
                  style={{
                    background: STATUS_COLORS[status].fill,
                    borderColor: STATUS_COLORS[status].stroke,
                  }}
                />
                <span class="font-mono text-[0.62rem] text-white/40">{label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div class="p-5 border-b border-white/5 grid grid-cols-3 gap-3">
            <div class="text-center">
              <p class="font-mono font-bold text-lg text-green-400">{state.visitedCount}</p>
              <p class="font-mono text-[0.55rem] uppercase tracking-wider text-white/25">Valides</p>
            </div>
            <div class="text-center">
              <p class="font-mono font-bold text-lg text-orange-400">{state.warningCount}</p>
              <p class="font-mono text-[0.55rem] uppercase tracking-wider text-white/25">Warnings</p>
            </div>
            <div class="text-center">
              <p class="font-mono font-bold text-lg text-red-400">{state.errorCount}</p>
              <p class="font-mono text-[0.55rem] uppercase tracking-wider text-white/25">Erreurs</p>
            </div>
          </div>

          {/* Controls */}
          <div class="p-5 flex flex-col gap-3 mt-auto">
            <button
              onClick$={runAnalysis}
              disabled={state.isRunning}
              aria-label="Lancer la simulation d'analyse Tree-sitter"
              class="w-full font-mono text-[0.65rem] tracking-widest uppercase py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-40 disabled:cursor-not-allowed bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
            >
              {state.isRunning ? "⏳ Analyse en cours…" : "▶ Lancer l'analyse"}
            </button>
            <button
              onClick$={resetAnalysis}
              disabled={state.isRunning}
              aria-label="Réinitialiser le graphe"
              class="w-full font-mono text-[0.65rem] tracking-widest uppercase py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-30 disabled:cursor-not-allowed bg-white/3 border-white/10 text-white/35 hover:text-white/60 hover:border-white/20"
            >
              ↺ Réinitialiser
            </button>
          </div>
        </aside>

        {/* ── CENTER: AST Canvas ── */}
        <div class="flex-1 flex flex-col min-h-0">

          {/* Status bar */}
          <div
            class={`px-6 py-3 border-b border-white/5 flex items-start gap-3 min-h-[56px] transition-colors duration-300 ${
              state.currentError
                ? "bg-red-500/5"
                : state.currentMessage.startsWith("✅")
                ? "bg-green-500/5"
                : state.currentMessage.startsWith("⚠")
                ? "bg-orange-500/5"
                : "bg-transparent"
            }`}
          >
            <p class="font-mono text-[0.72rem] text-white/60 leading-relaxed flex-1">
              {state.currentMessage}
            </p>
            {state.isDone && (
              <span class="shrink-0 font-mono text-[0.58rem] uppercase tracking-wider text-white/25 bg-white/5 px-2 py-1 rounded">
                Terminé
              </span>
            )}
          </div>

          {/* Canvas */}
          <div class="flex-1 relative overflow-hidden">
            <canvas
              id="ast-canvas"
              aria-hidden="true"
              role="presentation"
              class="w-full h-full"
              style="min-height: 420px;"
            />
            {/* Grid overlay */}
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-0"
              style="background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 28px 28px;"
            />
          </div>

          {/* Error detail panel */}
          {state.currentError && (
            <div
              role="alert"
              aria-live="assertive"
              class="border-t border-red-500/20 bg-red-500/5 px-6 py-4"
            >
              <div class="flex items-start gap-3">
                <span class="text-red-400 text-lg shrink-0" aria-hidden="true">⚠</span>
                <div>
                  <p class="font-mono text-[0.65rem] uppercase tracking-wider text-red-400/70 mb-1">
                    Diagnostic Tree-sitter
                  </p>
                  <p class="font-mono text-[0.72rem] text-red-300/80 leading-relaxed">
                    {state.currentError}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: AC + explications ── */}
        <aside class="lg:w-[280px] shrink-0 border-l border-white/5 flex flex-col overflow-y-auto">
          <div class="p-5 border-b border-white/5">
            <p class="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-white/25 mb-4">
              Compétences critiques
            </p>
            <div class="flex flex-col gap-3">
              {[
                { code: "AC12.01", label: "Analyse par méthode", desc: "Décomposition en règles d'analyse indépendantes sur l'AST" },
                { code: "AC12.02", label: "Comparaison", desc: "Complexité du parcours DFS vs BFS, couverture des patterns" },
                { code: "AC11.03", label: "Validation", desc: "Cas de test : vrais positifs, faux positifs, couverture" },
              ].map(({ code, label, desc }) => (
                <div key={code} class="bg-blue-500/5 border border-blue-500/15 rounded-lg p-3">
                  <span class="font-mono text-[0.58rem] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                    {code}
                  </span>
                  <p class="font-mono text-[0.65rem] text-white/60 mt-1.5 mb-1">{label}</p>
                  <p class="text-[0.72rem] text-white/35 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div class="p-5">
            <p class="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-white/25 mb-3">
              Comment ça marche
            </p>
            <div class="flex flex-col gap-3 text-[0.72rem] text-white/35 leading-relaxed">
              <p>
                <span class="text-white/50 font-medium">Tree-sitter</span> parse le code source en un arbre syntaxique abstrait (AST) en O(n).
              </p>
              <p>
                L'analyseur parcourt l'AST en <span class="text-white/50 font-medium">DFS</span> (Depth-First Search) et applique des règles à chaque nœud visité.
              </p>
              <p>
                Chaque règle produit un <span class="text-green-400/70">diagnostic</span> : erreur, avertissement ou validation.
              </p>
              <p>
                Règles implémentées : <span class="font-mono text-[0.65rem] text-blue-400/60">PTR001</span> (pointeurs bruts), <span class="font-mono text-[0.65rem] text-red-400/60">ARR002</span> (accès non borné).
              </p>
            </div>

            <a
              href="https://github.com/SticksOnTheBeach/AnalyzeStaticCode2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Voir le code source sur GitHub (s'ouvre dans un nouvel onglet)"
              class="mt-5 inline-flex items-center gap-2 font-mono text-[0.6rem] tracking-wider uppercase text-blue-400/60 border border-blue-500/20 px-3 py-2 rounded hover:text-blue-400 hover:border-blue-500/40 transition-colors w-full justify-center focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Code source
            </a>
          </div>
        </aside>
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Tree-sitter — Visualisation AST | AnalyzeStaticCode2",
  meta: [
    {
      name: "description",
      content: "Simulation interactive du parcours AST Tree-sitter — visualisation en temps réel de l'analyse statique de code C++",
    },
    { name: "robots", content: "noindex, nofollow" },
  ],
};

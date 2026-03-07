import { component$, useVisibleTask$ } from "@builder.io/qwik";

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  f: number;
  fs: number;
}

export const HeroSection = component$(() => {
  useVisibleTask$(({ cleanup }) => {
    const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let stars: Star[] = [];
    let rafId = 0;

    const resize = (): void => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const init = (): void => {
      stars = Array.from({ length: 130 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.9 + 0.2,
        a: Math.random() * 0.5 + 0.1,
        f: Math.random() * Math.PI * 2,
        fs: 0.005 + Math.random() * 0.01,
      }));
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        s.f += s.fs;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(s.a * (0.4 + 0.6 * Math.sin(s.f))).toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    const onResize = (): void => {
      resize();
      init();
    };

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
      id="hero"
      aria-label="Section d'accueil"
      class="slide relative h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      <canvas
        id="hero-canvas"
        aria-hidden="true"
        role="presentation"
        class="absolute inset-0 w-full h-full"
      />

      <div class="relative z-10 text-center px-8">
        <p class="font-mono text-[0.62rem] tracking-[0.35em] uppercase text-white/25 mb-6 animate-fade-up">
          BUT Informatique · Année 1 · 2025-2026
        </p>
        <h1
          class="font-display font-extrabold text-white leading-[0.93] tracking-tight animate-fade-up-delay-1"
          style="font-size: clamp(3rem, 9vw, 7.5rem);"
        >
          Portfolio &amp;<br />
          <span class="text-white/20">SAE / AC</span>
        </h1>
        <p class="mt-7 text-[0.88rem] text-white/30 tracking-wide animate-fade-up-delay-2">
          Trois projets · trois apprentissages · un programme
        </p>
      </div>

      <div
        aria-hidden="true"
        class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 animate-fade-up-delay-4"
      >
        <div class="w-px h-11 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        <span class="font-mono text-[0.55rem] tracking-[0.25em] text-white/20 uppercase">
          Défiler
        </span>
      </div>
    </section>
  );
});

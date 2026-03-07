/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', "monospace"],
        display: ["Syne", "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
      colors: {
        green: {
          glow: "#4ade80",
        },
        blue: {
          glow: "#60a5fa",
        },
        warm: {
          DEFAULT: "#d4a574",
        },
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.8" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.9s ease both",
        "fade-up-delay-1": "fadeUp 0.9s 0.3s ease both",
        "fade-up-delay-2": "fadeUp 0.9s 0.5s ease both",
        "fade-up-delay-3": "fadeUp 0.9s 0.7s ease both",
        "fade-up-delay-4": "fadeUp 0.9s 1.1s ease both",
        pulse: "pulse 2s infinite",
        blink: "blink 1.1s step-start infinite",
      },
    },
  },
  plugins: [],
};

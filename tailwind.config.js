/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /** Near-black type and its greys */
        ink: {
          DEFAULT: "#1d1d1f",
          soft: "#424245",
          muted: "#6e6e73",
          faint: "#86868b",
        },
        /** Page surfaces */
        paper: "#ffffff",
        mist: "#f5f5f7",
        shell: "#faf7f4",
        hairline: "rgba(29, 29, 31, 0.1)",
        /** Brand: ocean teal for actions */
        tide: {
          50: "#eefaf8",
          100: "#d6f2ef",
          200: "#aee3de",
          400: "#2bb5ad",
          500: "#0e9e97",
          600: "#0b7d78",
          700: "#0a6661",
          800: "#0b4f4c",
        },
        blush: "#f4b8c8",
        peach: "#f6c9a3",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        display: "-0.035em",
        tightish: "-0.02em",
      },
      boxShadow: {
        tile: "0 1px 2px rgba(29, 29, 31, 0.04), 0 12px 36px -16px rgba(29, 29, 31, 0.14)",
        device: "0 2px 6px rgba(29, 29, 31, 0.08), 0 50px 100px -30px rgba(29, 29, 31, 0.35)",
        cta: "0 10px 30px -10px rgba(11, 125, 120, 0.6)",
      },
      keyframes: {
        dot: {
          "0%, 60%, 100%": { opacity: "0.35", transform: "translateY(0)" },
          "30%": { opacity: "1", transform: "translateY(-3px)" },
        },
        nudge: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(6px)", opacity: "1" },
        },
        fall: {
          to: { transform: "translate3d(var(--x, 0), 105vh, 0) rotate(540deg)", opacity: "0" },
        },
        /** Sale ribbon: flakes drift down through the bar, a soft sheen sweeps across it */
        snow: {
          "0%": { transform: "translate3d(0, -12px, 0)", opacity: "0" },
          "15%": { opacity: "var(--o, 0.8)" },
          "85%": { opacity: "var(--o, 0.8)" },
          "100%": { transform: "translate3d(var(--drift, 8px), 72px, 0)", opacity: "0" },
        },
        sheen: {
          "0%": { transform: "translateX(-100%)" },
          "60%, 100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        dot: "dot 1.2s ease-in-out infinite",
        nudge: "nudge 2.2s ease-in-out infinite",
        fall: "fall 2.4s ease-in forwards",
        snow: "snow var(--d, 6s) linear infinite",
        sheen: "sheen 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

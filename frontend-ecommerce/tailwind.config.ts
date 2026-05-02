import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171511",
        paper: {
          DEFAULT: "#fbfaf7",
          deep: "#f5f1e8",
          warm: "#f8f3e8",
        },
        linen: "#f1ece3",
        moss: {
          DEFAULT: "#273f32",
          soft: "#3d5a48",
        },
        clay: {
          DEFAULT: "#9c5f3f",
          soft: "#c98565",
          deep: "#6f4128",
        },
        indigo: "#2f405f",
        whats: {
          DEFAULT: "#128c7e",
          deep: "#0e6b60",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Times New Roman", "Georgia", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SF Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        flat: "0 1px 0 rgba(23, 21, 17, 0.04)",
        soft: "0 18px 60px rgba(23, 21, 17, 0.08)",
        hover: "0 24px 70px rgba(23, 21, 17, 0.12)",
      },
      letterSpacing: {
        "widest-label": "0.22em",
        "wide-label": "0.16em",
        "mid-label": "0.14em",
      },
      transitionTimingFunction: {
        commerce: "cubic-bezier(.2,.7,.2,1)",
      },
    },
  },
  plugins: [],
};

export default config;

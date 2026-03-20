import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        litter: {
          50:  "#fdf8ee",
          100: "#f9edcc",
          200: "#f2d88a",
          300: "#eac050",
          400: "#e2a827",
          500: "#c98a18",
          600: "#a06a12",
          700: "#7a4e10",
          800: "#553613",
          900: "#3a2410",
        },
        ink: {
          50:  "#f5f4f0",
          100: "#e8e6df",
          200: "#cdc9be",
          300: "#aba596",
          400: "#857e6e",
          500: "#635c4e",
          600: "#4a4438",
          700: "#332f26",
          800: "#1e1b16",
          900: "#111009",
        },
      },
      animation: {
        "dust-float": "dustFloat 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "grain": "grain 0.5s steps(1) infinite",
      },
      keyframes: {
        dustFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)", opacity: "0.6" },
          "33%": { transform: "translateY(-8px) rotate(2deg)", opacity: "0.9" },
          "66%": { transform: "translateY(-4px) rotate(-1deg)", opacity: "0.7" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(2%, 2%)" },
          "30%": { transform: "translate(-1%, 3%)" },
          "40%": { transform: "translate(3%, -1%)" },
          "50%": { transform: "translate(-2%, 2%)" },
          "60%": { transform: "translate(1%, -2%)" },
          "70%": { transform: "translate(-3%, 1%)" },
          "80%": { transform: "translate(2%, 3%)" },
          "90%": { transform: "translate(-1%, -1%)" },
        },
      },
      backgroundImage: {
        "noise": "url('/noise.svg')",
      },
    },
  },
  plugins: [],
};
export default config;

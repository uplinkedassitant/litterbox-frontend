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
        sheesh: {
          50:  "#fff9e6",
          100: "#ffedb3",
          200: "#ffe166",
          300: "#ffd426",
          400: "#ffdc00",
          500: "#ccb000",
          600: "#998500",
          700: "#665900",
          800: "#332c00",
          900: "#1a1600",
        },
        bg: {
          primary:   "#0a0a0a",
          secondary: "#111111",
          card:      "#161616",
          elevated:  "#1c1c1c",
        },
      },
      animation: {
        "dust-float": "dustFloat 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        dustFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)", opacity: "0.6" },
          "33%": { transform: "translateY(-8px) rotate(2deg)", opacity: "0.9" },
          "66%": { transform: "translateY(-4px) rotate(-1deg)", opacity: "0.7" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,220,0,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255,220,0,0.5)" },
        },
      },
      maxWidth: {
        'center': '480px',
      },
    },
  },
  plugins: [],
};
export default config;

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
        heading: ['Bangers', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        'litter-black': '#000000',
        'litter-blue': '#4A90E2',
        'litter-yellow': '#FFD700',
        'litter-dirty': '#EDEDED',
        'litter-neon-blue': '#00FFFF',
        'litter-neon-yellow': '#FFFF00',
      },
      animation: {
        "wiggle": "wiggle 0.5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,215,0,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255,215,0,0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

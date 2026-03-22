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
        heading: ['Permanent Marker', 'cursive'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'litter-bg': '#0f0f0f',
        'litter-card': '#1a1a1a',
        'litter-brown': '#8B7355',
        'litter-text': '#e5ded3',
      },
    },
  },
  plugins: [],
};
export default config;

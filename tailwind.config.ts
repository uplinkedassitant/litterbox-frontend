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
        heading: ['Agbalumo', 'cursive'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'litter-bg': '#0f0f0f',
        'litter-card': '#1a1a1a',
        'litter-text': '#ffffff',
        'litter-muted': '#888888',
      },
    },
  },
  plugins: [],
};
export default config;

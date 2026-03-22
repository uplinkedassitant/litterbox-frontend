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
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'litter-bg': '#e5ded3',
        'litter-light': '#F5F2EB',
        'litter-dark': '#D4CFC2',
        'litter-brown': '#8B7355',
        'litter-text': '#1a1a1a',
      },
    },
  },
  plugins: [],
};
export default config;

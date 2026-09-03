import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        scrap: {
          bg: "#0D1117",
          card: "#161B22",
          cardHover: "#1F2937",
          border: "#30363D",
          borderHover: "#484F58",
          primary: "#00C853",
          primaryHover: "#00E676",
          primaryDark: "#009624",
          gold: "#FFD600",
          goldHover: "#FFE57F",
          muted: "#8B949E",
          light: "#F0F6FC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(0, 200, 83, 0.3)",
        glowGold: "0 0 20px -5px rgba(255, 214, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;

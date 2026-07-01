import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#090d16",
          panel: "#101624",
          panelSoft: "#151d2d",
          line: "#253047",
          cyan: "#16c7d8",
          blue: "#4f7cff",
          violet: "#8b5cf6"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(22, 199, 216, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;

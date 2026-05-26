import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx,js,json}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        accentHover: "var(--accent-hover)",
        header: "var(--header)",
        border: "var(--border)",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.08)",
        lift: "0 20px 45px rgba(15, 23, 42, 0.12)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(226, 232, 240, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.45) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
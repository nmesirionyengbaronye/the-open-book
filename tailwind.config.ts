import { type Config } from "tailwindcss";

export default {
   darkMode: ["class"],
   content: [
     "./app/**/*.{js,ts,jsx,tsx,mdx}",
     "./components/**/*.{js,ts,jsx,tsx,mdx}",
   ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#0A0A0F",
        foreground: "#FFFFFF",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#FFD700",
          glow: "rgba(212, 175, 55, 0.3)",
        },
        surface: "#13131A",
        border: "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        heading: ["Bebas Neue"],
        body: ["Syne"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        handwriting: ["var(--font-handwriting)", "Caveat", "cursive"],
      },
      animation: {
        "gradient-shift": "gradient-shift 15s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;

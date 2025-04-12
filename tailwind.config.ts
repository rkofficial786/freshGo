import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        samarkan: ["Samarkan", "cursive"],
        // sans: ["var(--font-lato)", "sans-serif"],
        // serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          50: "hsl(210, 100%, 97%)",
          100: "hsl(210, 100%, 94%)",
          200: "hsl(210, 100%, 89%)",
          300: "hsl(210, 100%, 84%)",
          400: "hsl(210, 100%, 74%)",
          500: "hsl(210, 100%, 60%)",
          600: "hsl(210, 100%, 50%)",
          700: "hsl(210, 100%, 40%)",
          800: "hsl(210, 100%, 30%)",
          900: "hsl(210, 100%, 20%)",
          950: "hsl(210, 100%, 10%)",
          DEFAULT: "hsl(210, 100%, 30%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        secondary: {
          50: "hsl(210, 100%, 97%)",
          100: "hsl(210, 100%, 94%)",
          200: "hsl(210, 100%, 89%)",
          300: "hsl(210, 100%, 84%)",
          400: "hsl(210, 100%, 74%)",
          500: "hsl(210, 100%, 60%)",
          600: "hsl(210, 100%, 50%)",
          700: "hsl(210, 100%, 40%)",
          800: "hsl(210, 100%, 30%)",
          900: "hsl(210, 100%, 20%)",
          950: "hsl(210, 100%, 10%)",
          DEFAULT: "hsl(210, 100%, 30%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        accent: {
          50: "hsl(210, 100%, 97%)",
          100: "hsl(210, 100%, 94%)",
          200: "hsl(210, 100%, 89%)",
          300: "hsl(210, 100%, 84%)",
          400: "hsl(210, 100%, 74%)",
          500: "hsl(210, 100%, 60%)",
          600: "hsl(210, 100%, 50%)",
          700: "hsl(210, 100%, 40%)",
          800: "hsl(210, 100%, 30%)",
          900: "hsl(210, 100%, 20%)",
          950: "hsl(210, 100%, 10%)",
          DEFAULT: "hsl(210, 100%, 20%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          50: "hsl(0, 0%, 98%)",
          100: "hsl(0, 0%, 96%)",
          200: "hsl(0, 0%, 90%)",
          300: "hsl(0, 0%, 84%)",
          400: "hsl(0, 0%, 74%)",
          500: "hsl(0, 0%, 65%)",
          600: "hsl(0, 0%, 55%)",
          700: "hsl(0, 0%, 45%)",
          800: "hsl(0, 0%, 35%)",
          900: "hsl(0, 0%, 25%)",
          950: "hsl(0, 0%, 15%)",
          DEFAULT: "hsl(0, 0%, 90%)",
          foreground: "hsl(0, 0%, 20%)",
        },
        destructive: {
          50: "hsl(0, 100%, 97%)",
          100: "hsl(0, 100%, 94%)",
          200: "hsl(0, 100%, 89%)",
          300: "hsl(0, 100%, 84%)",
          400: "hsl(0, 100%, 74%)",
          500: "hsl(0, 100%, 65%)",
          600: "hsl(0, 100%, 55%)",
          700: "hsl(0, 100%, 45%)",
          800: "hsl(0, 100%, 35%)",
          900: "hsl(0, 100%, 25%)",
          950: "hsl(0, 100%, 15%)",
          DEFAULT: "hsl(0, 100%, 40%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        border: "hsl(0, 0%, 80%)",
        input: "hsl(0, 0%, 85%)",
        ring: "hsl(0, 100%, 70%)",
        chart: {
          "1": "hsl(0, 100%, 50%)", // Red (primary)
          "2": "hsl(210, 100%, 30%)", // Deep blue (secondary)
          "3": "hsl(45, 100%, 50%)", // Bright yellow (accent)
          "4": "hsl(150, 50%, 40%)", // Muted green
          "5": "hsl(280, 50%, 40%)", // Muted purple
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

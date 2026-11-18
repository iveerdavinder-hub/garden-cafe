/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        surface: "hsl(var(--surface) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        espresso: {
          DEFAULT: "#26160e",
          brown: "#6b3a1f",
          deep: "#1c110b",
          light: "#824b2c",
        },
        cream: {
          DEFAULT: "#faf6ef",
          light: "#fdfbf7",
          dark: "#f2ece0",
        },
        amber: {
          warm: "#c9833a",
          gold: "#d8964d",
          light: "#f6ecd8",
        },
        oat: "#f1ece1",
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.12em',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -1px rgba(38, 22, 14, 0.06)',
        'warm-md': '0 8px 24px -4px rgba(38, 22, 14, 0.08), 0 2px 6px -1px rgba(38, 22, 14, 0.04)',
        'warm-lg': '0 20px 40px -12px rgba(38, 22, 14, 0.12), 0 4px 12px -2px rgba(38, 22, 14, 0.04)',
      },
    },
  },
  plugins: [],
}

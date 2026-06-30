/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#F8F9FE",
          green: "#006C4A",
          greenBtn: "#007A55",
          greenHover: "#005C3F",
          mint: "#10B981",
          mintBg: "#EAFBF5",
          mintBgSoft: "#F0FBF7",
        },
        border: {
          DEFAULT: "#E5E7EB",
          soft: "#EEF0F5",
          input: "#D0D5DD",
        },
        ink: {
          DEFAULT: "#111827",
          secondary: "#667085",
          muted: "#9CA3AF",
          placeholder: "#A0A7B5",
        },
        danger: {
          DEFAULT: "#D92D20",
          border: "#D14343",
        },
      },
      boxShadow: {
        soft: "0 8px 24px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
}
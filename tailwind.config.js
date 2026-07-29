/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        teal: "#14B8A6",
        sky: "#38BDF8",
        green: "#22C55E",
        background: "#F8FAFC",
        text: "#0F172A",
        muted: "#64748B",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

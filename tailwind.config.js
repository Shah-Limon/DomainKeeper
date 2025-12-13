/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0f172a', // Slate 900
        secondary: '#334155', // Slate 700
        accent: '#3b82f6', // Blue 500
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'korean-red': '#D73502',
        'korean-blue': '#003F7F',
        'korean-yellow': '#FFC72C',
        'korean-green': '#228B22',
        'traditional-paper': '#F5F5DC',
        'ink-black': '#2C3E50',
      },
      fontFamily: {
        'korean': ['Noto Sans KR', 'sans-serif'],
        'serif-kr': ['Noto Serif KR', 'serif'],
      }
    },
  },
  plugins: [],
}
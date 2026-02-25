/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pit: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          accent: '#0ea5e9',
          gold: '#f59e0b',
          green: '#22c55e',
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F7F5',
        primary: '#1A1A1A',
        secondary: '#6F6F6F',
        accent: '#3F8CFF',
        alert: '#FFD166',
        border: '#E5E5E5',
      },
      fontFamily: {
        sans: ['Inter', 'Rubik', 'Nunito', 'sans-serif'],
      },
      maxWidth: {
        'notion': '880px',
      },
      boxShadow: {
        'notion': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'notion-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}


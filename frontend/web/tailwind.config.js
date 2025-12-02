/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
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


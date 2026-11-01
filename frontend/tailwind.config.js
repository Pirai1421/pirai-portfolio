/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: 'var(--color-bg-canvas)',
          900: 'var(--color-bg-card)',
          850: 'var(--color-bg-elevated)',
          800: 'var(--color-bg-subtle)',
          700: 'var(--color-border)',
          600: 'var(--color-border-subtle)',
        },
        electric: {
          cyan: '#00e5ff',
          blue: '#0284c7',
          sky: '#38bdf8',
          accent: '#2563eb',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle-cyan': '0 0 20px -5px rgba(0, 229, 255, 0.15)',
        'subtle-blue': '0 0 25px -5px rgba(37, 99, 235, 0.2)',
      }
    },
  },
  plugins: [],
}

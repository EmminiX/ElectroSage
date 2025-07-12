/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'lexend': ['Lexend', 'Inter', 'system-ui', 'sans-serif'],
        'opendyslexic': ['OpenDyslexic', 'system-ui', 'sans-serif'],
        'dyslexie': ['Dyslexie', 'system-ui', 'sans-serif'],
        'atkinson': ['Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
      },
      colors: {
        electric: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        atom: {
          proton: '#ff6b6b',
          neutron: '#95a5a6',
          electron: '#74b9ff',
        }
      },
      animation: {
        'electron-orbit': 'orbit 2s linear infinite',
        'current-flow': 'flow 1.5s ease-in-out infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
        flow: {
          '0%, 100%': { opacity: 0.5, transform: 'translateX(0)' },
          '50%': { opacity: 1, transform: 'translateX(10px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

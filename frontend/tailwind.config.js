/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f6ef7',
          hover: '#3b5bdb',
          light: '#eef2ff',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        sidebar: {
          DEFAULT: '#0f172a',
          hover: '#1e293b',
        },
        bg: {
          primary: '#f8fafc',
          card: '#ffffff',
        },
        slate: {
          850: '#0f2044',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10)',
        'card-xl': '0 8px 30px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        card: '12px',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'count-up': 'countUp 0.8s ease-out forwards',
        'progress-step': 'progressStep 0.5s ease forwards',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressStep: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}

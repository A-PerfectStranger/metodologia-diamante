/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pichincha: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          pale: '#f5f3ff',
        },
        brand: {
          success: '#10b981',
          danger: '#f43f5e',
          warning: '#f59e0b',
          dark: '#111827',
        },
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.7' },
        },
        progressFill: {
          from: { width: '0%' },
          to: { width: '100%' },
        },
        notifDrop: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.35s ease-out both',
        'fade-in': 'fadeIn 0.25s ease-out both',
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite',
        'notif-drop': 'notifDrop 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}

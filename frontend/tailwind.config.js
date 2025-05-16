/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        accent: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 6px 12px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-scale': 'pulseScale 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  safelist: [
    // Background colors
    'bg-accent-100', 'bg-accent-200', 'bg-accent-300', 'bg-accent-400', 'bg-accent-500',
    'bg-accent-600', 'bg-accent-700', 'bg-accent-800', 'bg-accent-900', 'bg-accent-950',
    'dark:bg-accent-800', 'dark:bg-accent-900', 'dark:bg-accent-950',

    // Text colors
    'text-accent-400', 'text-accent-500', 'text-accent-600', 'text-accent-700',
    'dark:text-accent-300', 'dark:text-accent-400', 'dark:text-accent-500',

    // Border colors
    'border-accent-500', 'border-accent-600', 'border-accent-700',
    'dark:border-accent-600', 'dark:border-accent-700', 'dark:border-accent-800',

    // Gradient colors
    'from-accent-500', 'to-accent-300', 'to-accent-400', 'to-accent-600',
    'dark:from-accent-600', 'dark:to-accent-800', 'dark:from-accent-500', 'dark:to-accent-700',
    'from-accent-600', 'to-accent-500', 'hover:from-accent-700', 'hover:to-accent-600',

    // Other colors
    'bg-green-500', 'bg-purple-500', 'bg-blue-500', 'bg-indigo-500', 'bg-pink-500',
    'text-green-500', 'text-purple-500', 'text-blue-500', 'text-indigo-500', 'text-pink-500',

    // Primary colors
    'bg-primary-50', 'bg-primary-100', 'bg-primary-800', 'bg-primary-900', 'bg-primary-950',
    'dark:bg-primary-800', 'dark:bg-primary-900', 'dark:bg-primary-950',
  ],
}

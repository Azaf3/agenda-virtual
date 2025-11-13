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
        primary: {
          400: '#9A5CFF',
          500: '#7B2FF7',
          600: '#6624D1',
          DEFAULT: '#7B2FF7',
        },
        secondary: {
          400: '#33DCFF',
          500: '#00D4FF',
          600: '#00B6DB',
          DEFAULT: '#00D4FF',
        },
        accent: {
          400: '#FF7AD9',
          500: '#FF5BCD',
          600: '#E044B4',
          DEFAULT: '#FF5BCD',
        },
        background: {
          DEFAULT: '#FFFFFF',
          component: '#F7F8FC',
        },
        text: {
          DEFAULT: '#1F2937',
          secondary: '#6B7280',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(90deg, #7B2FF7 0%, #00D4FF 100%)',
        'gradient-accent': 'linear-gradient(90deg, #FF5BCD 0%, #7B2FF7 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}

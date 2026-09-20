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
        brand: {
          50: '#EEF4FE',
          100: '#D9E5FD',
          200: '#B3CBFC',
          300: '#86AAFA',
          400: '#5B86F5',
          500: '#356AE6',
          600: '#2552C7',
          700: '#1C3FA0',
          800: '#16307B',
          900: '#102155',
          950: '#08102C',
        },
        teal: {
          50: '#EFFBF8',
          100: '#D5F5EF',
          200: '#ADEAE0',
          300: '#7BDACC',
          400: '#4DC8B5',
          500: '#36B8A0',
          600: '#289984',
          700: '#1E7868',
          800: '#185E52',
          900: '#12443C',
          950: '#0A2622',
        },
        privacy: {
          50: '#EEF4FE',
          100: '#D9E5FD',
          200: '#B3CBFC',
          300: '#86AAFA',
          400: '#5B86F5',
          500: '#356AE6',
          600: '#2552C7',
          700: '#1C3FA0',
          800: '#16307B',
          900: '#102155',
        },
        canvas: {
          light: '#F4F7FB',
          dark: '#0B1120',
        },
        surface: {
          light: '#F4F7FB',
          card: '#FFFFFF',
          dark: '#0B1120',
          darkcard: '#151F32',
          darkborder: '#1E293B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F61B9',
          dark: '#1a529e',
          light: '#E8F0FA',
        },
        secondary: {
          DEFAULT: '#719CAE',
          dark: '#5f8899',
          light: '#EDF3F6',
        },
        navy: {
          DEFAULT: '#17203C',
          secondary: '#3D4B53',
        },
        accent: {
          DEFAULT: '#E87C4A',
          dark: '#d06b3d',
          light: '#FDF0EA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F7FA',
          border: '#E5E8EC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(23 32 60 / 0.06), 0 1px 2px -1px rgb(23 32 60 / 0.06)',
        elevated: '0 4px 12px -2px rgb(23 32 60 / 0.1)',
      },
    },
  },
  plugins: [],
};

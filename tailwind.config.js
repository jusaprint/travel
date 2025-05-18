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
          DEFAULT: '#013D91',
          50: '#f0f7ff',
          100: '#e0eeff',
          200: '#b9ddff',
          300: '#7cc2ff',
          400: '#36a9ff',
          500: '#0090ff',
          600: '#0070ff',
          700: '#013D91',
          800: '#0040a0',
          900: '#003380',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
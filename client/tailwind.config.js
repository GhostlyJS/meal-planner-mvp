/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f5f7ff',
            100: '#ebeeff',
            200: '#d8dfff',
            300: '#b6c1ff',
            400: '#8a93ff',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
          },
        },
      },
    },
    plugins: [],
  }
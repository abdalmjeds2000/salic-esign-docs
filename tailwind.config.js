/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
    extend: {
      backgroundColor: {
        'main-bg': '#f8f9fa',
        'main-dark-bg': '#20232A',
        'secondary-dark-bg': '#1f2126',
        'third-dark-bg': '#23272d',

        'active-color': '#c7d2dd',
        'blue-active-color': '#1a4971',
        'light-gray': '#f8f9fa',
        'dark-bg': '#343a40',

        'half-transparent': 'rgba(0, 0, 0, 0.5)',
        'transparent-white': 'rgba(240, 240, 240, 0.8)',
      },
      textColor: {
        'text-color': '#485056',
        'active-color': '#1a4971',
        'light-active-color': '#52a7ef',
      },
      borderColor: {
        'active-color': '#1a4971',
      }
    },
  },
  plugins: [],
}
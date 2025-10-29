// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightgray: '#3d3d3d', // or 'rgb(var(--my-color) / <alpha-value>)' if using CSS variables
      },
    },
  },
  plugins: [],
};

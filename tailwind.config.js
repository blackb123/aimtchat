/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",       // include root html
    "./src/**/*.{js,jsx,ts,tsx}"  // scan all React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

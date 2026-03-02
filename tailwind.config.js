/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf5f3",
          100: "#fae6df",
          500: "#d95d39",
          700: "#9c3f28"
        }
      }
    }
  },
  plugins: []
};

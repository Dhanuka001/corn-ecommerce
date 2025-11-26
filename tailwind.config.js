/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          light: "#F7F3EE",
          DEFAULT: "#E8E2DA",
          dark: "#B2A59F",
        },
        text: "#1A1A1A",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "media",
  plugins: [require("daisyui")],
  theme: {
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
    },
  },
  daisyui: {
    themes: ["sunset"],
  },
};

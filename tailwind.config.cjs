/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
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

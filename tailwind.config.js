/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      dancing: ["Dancing Script", "cursive"],
      roboto: ["Roboto", "sans-serif"],
      lobster: ["Lobster", "cursive"],
      roman: ["Great Vibes", "cursive", "Times New Roman", "Times", "serif"],
    },
    extend: {},
  },
  plugins: [],
};

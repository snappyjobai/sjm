/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1c1c22",
        accent: {
          DEFAULT: "#6CB4EE",
          hover: "#6CB4FF",
        },
      },
      fontFamily: {
        primary: ["var(--font-roboto)", "sans-serif"],
        heading: ["var(--font-aclonica)", "sans-serif"],
        subtext: ["var(--font-coda)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

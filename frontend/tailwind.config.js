/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a1a1a",
          light: "#1a1a1ae3",
          dark: "#ffffff",
        },
        accent: "#dfa46d",
        background: {
          DEFAULT: "#f8f7f2",
          secondary: "rgba(242, 240, 235, 1)",
          dark: "#1a1a1a",
          "dark-secondary": "#2a2a2a",
        },
        text: {
          DEFAULT: "#1a1a1a",
          secondary: "#666666",
          dark: "#ffffff",
          "dark-secondary": "#a0a0a0",
        },
        border: { DEFAULT: "#e2e2e2", dark: "#3a3a3a" },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};

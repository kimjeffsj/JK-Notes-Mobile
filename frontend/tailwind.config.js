/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a1a1a",
          light: "#1a1a1ae3",
        },
        accent: "#dfa46d",
        background: {
          DEFAULT: "#f8f7f2",
          secondary: "rgba(242, 240, 235, 1)",
        },
        text: {
          DEFAULT: "#1a1a1a",
          secondary: "#666666",
        },
        border: "#e2e2e2",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};

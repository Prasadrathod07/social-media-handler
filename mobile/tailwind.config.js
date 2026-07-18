/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f0ff",
          100: "#e6e1ff",
          200: "#cabdff",
          300: "#a892ff",
          400: "#8563ff",
          500: "#6a3bff",
          600: "#5522eb",
          700: "#4419bd",
          800: "#361897",
          900: "#2c1774",
        },
        success: "#1fb87d",
        warning: "#f5a524",
        danger: "#f24e5c",
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
        bold: ["Inter_700Bold"],
      },
      borderRadius: {
        xl: "20px",
        "2xl": "28px",
      },
    },
  },
  plugins: [],
};

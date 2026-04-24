/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'soft-white': '#f8fafc',
        'charcoal': '#1e293b',
        'emergency-red': '#ef4444',
      }
    },
  },
  plugins: [],
}

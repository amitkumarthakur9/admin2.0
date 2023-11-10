/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}",
    "./app/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        '11.8/12': '98%',
        "96.3%": '96.3%',
      }
    },
  },
  plugins: [],
}


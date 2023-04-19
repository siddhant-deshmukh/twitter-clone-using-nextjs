/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: '600px',
      sm2:'750px',
      md: '1020px',
      lg: '1108px',
      xl: '1296px',
    },
  },
  plugins: [],
}

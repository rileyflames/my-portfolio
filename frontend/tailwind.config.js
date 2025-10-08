/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Custom minimalist color palette
        'primary': {
          DEFAULT: '#3E1E68', // Deep purple - primary brand color
          light: '#5A3A8A',   // Lighter purple for hovers
          dark: '#2A1448',    // Darker purple for emphasis
        },
        'neutral': {
          50: '#FFFFFF',      // Pure white
          100: '#F9F5F0',     // Warm off-white
          200: '#F5EFE6',     // Cream
          300: '#EEEEEE',     // Light gray
          400: '#D1D1D1',     // Medium gray
          500: '#9E9E9E',     // Gray
          600: '#757575',     // Dark gray
          700: '#616161',     // Darker gray
          800: '#424242',     // Very dark gray
          900: '#212121',     // Almost black
        },
        'accent': {
          cream: '#F9F5F0',
          beige: '#F5EFE6',
          gray: '#EEEEEE',
        }
      },
    },
  },
  plugins: [],
}
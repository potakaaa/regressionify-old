/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'orange': {
          DEFAULT: '#FF6500'
        },
        'light-blue': {
          DEFAULT: '#1E3E62'
        },
        'dark-blue': {
          DEFAULT: '#0B192C'
        },
        'dark-green': {
          DEFAULT: '#181C14'
        },
        'dark-grey': {
          DEFAULT: '#3C3D37'
        },
        'light-green': {
          DEFAULT: '#697565'
        },
        'beige': {
          DEFAULT: '#ECDFCC'
        }
        
      }, 
      fontFamily: {
        Inter: ["Inter"]
      }
    },
  container: {
    center: true,
  }
  },
  plugins: [],
}
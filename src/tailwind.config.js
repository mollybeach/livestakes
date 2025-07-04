/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-once': 'bounce 0.6s ease-in-out 1',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'blink-effect': 'blinkEffect 0.3s ease-out',
        'lightning-flash': 'lightningFlash 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blinkEffect: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.7' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        lightningFlash: {
          '0%': { transform: 'scale(1)', opacity: '1', boxShadow: '0 0 0px #ec4899' },
          '20%': { transform: 'scale(1.2)', opacity: '1', boxShadow: '0 0 20px #ec4899' },
          '50%': { transform: 'scale(0.95)', opacity: '0.8', boxShadow: '0 0 10px #ec4899' },
          '70%': { transform: 'scale(1.05)', opacity: '1', boxShadow: '0 0 15px #ec4899' },
          '100%': { transform: 'scale(1)', opacity: '1', boxShadow: '0 0 0px #ec4899' },
        },
      },
    },
  },
  plugins: [],
}


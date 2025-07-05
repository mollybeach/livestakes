/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Profile page colors
                periwinkle: '#7a8bff', // Section backgrounds
                coral: '#f7b7de', // Stats cards background
                lavender: '#e9d5ff', // Purple-50 equivalent
                plum: '#581c87', // Purple-900 equivalent
                cream: '#fff8ef', // Light creamy off-white
                eggshell: '#fefce8', // Yellow-50 equivalent
                butter: '#fef08a', // Yellow-200 equivalent
                gold: '#facc15', // Yellow-400 equivalent
                sage: '#dcfce7', // Green-200 equivalent
                forest: '#166534', // Green-900 equivalent
                slate: '#e2e8f0', // Gray-200 equivalent
                charcoal: '#1f2937', // Gray-900 equivalent
                steel: '#374151', // Gray-800 equivalent
                rust: '#fecaca', // Red-200 equivalent
                burgundy: '#7f1d1d', // Red-900 equivalent
                sky: '#bfdbfe', // Blue-200 equivalent
                navy: '#1e3a8a', // Blue-900 equivalent
                mauve: '#f3e8ff', // Purple-200 equivalent
                fuchsia: '#db2777', // Pink-600 equivalent
            },
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
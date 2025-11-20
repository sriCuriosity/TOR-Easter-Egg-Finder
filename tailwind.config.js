/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    900: '#0a192f',
                    800: '#112240',
                    700: '#233554',
                },
                slate: {
                    800: '#1e293b', // Sidebar bg
                    900: '#0f172a', // Main bg
                },
                accent: {
                    green: '#64ffda',
                    red: '#ef4444',
                    blue: '#3b82f6',
                }
            },
            fontFamily: {
                mono: ['"Fira Code"', 'monospace'],
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

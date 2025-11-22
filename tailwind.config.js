/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gov: {
                    primary: '#1b2a4e',
                    secondary: '#2e5aac',
                    success: '#2e8540',
                    warning: '#f0b429',
                    danger: '#b50909'
                }
            },
            fontFamily: {
                mono: ['"Fira Code"', 'monospace'],
                sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

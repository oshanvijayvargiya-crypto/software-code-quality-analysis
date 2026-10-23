/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-void': '#05070A',
        'surface-subdued': '#0B1117',
        'scanner-green': '#00FF9D',
        'critical-red': '#FF3B30',
        'warning-amber': '#FFCC00',
        'muted-steel': '#8B949E',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(300px)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        scan: 'scan 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

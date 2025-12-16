/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          600: 'hsl(226 95% 58%)',
          400: '#8aabff',
          300: '#a8c0ff',
        },
        'brand-lilac': {
          600: 'hsl(276 60% 68%)',
        },
        'black': {
          900: 'hsl(240 6% 5%)',
          800: 'hsl(0 0% 9%)',
          600: 'hsl(0 0% 20%)',
        },
        'white': {
          900: 'hsl(0 0% 100%)',
          800: 'hsl(0 0% 90%)',
          700: 'rgba(255, 255, 255, 0.8)',
          600: 'hsl(0 0% 70%)',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
        heading: ['Roboto', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': 'calc(var(--radius) - 4px)',
        'md': 'calc(var(--radius) - 2px)',
        'lg': 'var(--radius)',
        'xl': 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [],
}

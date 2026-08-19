/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        stage: '#050505',
        ink: 'var(--ink, #fafafa)',
        muted: 'var(--muted, #a7a6a6)',
        nav: 'var(--nav, #b6b5b5)',
        strip: 'var(--strip, #8b8a8a)',
        pill: 'var(--pill, #ffffff)',
        'pill-ink': 'var(--pill-ink, #050505)',
        critical: 'var(--critical, #ef4444)',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mark: ['IpsumMark', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

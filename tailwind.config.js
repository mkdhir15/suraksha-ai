/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        stage: 'var(--stage)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        border: 'var(--border)',
        'text-primary': 'var(--text-primary)',
        muted: 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-light': 'var(--accent-light)',
        critical: 'var(--critical)',
        success: 'var(--success)',
        caution: 'var(--caution)',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

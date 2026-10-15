import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'accent-green': 'var(--accent-green)',
        'accent-cyan': 'var(--accent-cyan)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
} satisfies Config

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,png,svg}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#f5f6f9',
          800: '#fafbfd',
          700: '#ffffff',
          600: '#eef0f5',
          500: '#e6e9f0',
        },
        accent: {
          DEFAULT: '#6e75e8',
          soft: '#8b91f0',
          deep: '#5a61d8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}

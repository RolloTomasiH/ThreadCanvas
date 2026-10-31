/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: '#F8FAFC',
          grid: '#E2E8F0',
          darkBg: '#0F172A',
          darkGrid: '#1E293B',
        },
        mac: {
          border: '#E2E8F0',
          card: '#FFFFFF',
          text: '#0F172A',
          subtext: '#64748B',
          accent: '#2563EB',
          accentLight: '#EFF6FF',
          success: '#16A34A',
          amber: '#D97706',
          purple: '#7C3AED',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'mac': '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'mac-hover': '0 10px 30px -3px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'mac-active': '0 0 0 2px #2563EB, 0 8px 24px -4px rgba(37, 99, 235, 0.2)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Houston Resilience Hub color system from PRD
        primary: '#0E4F9E',
        accent: '#1062D0', 
        success: '#1B9E4B',
        warning: '#B8860B',
        muted: '#6B7280',
        text: '#0B1220',
        bg: '#FFFFFF',
        // Status colors
        open: '#1B9E4B',
        'at-capacity': '#B8860B',
        closed: '#6B7280',
        // Emergency alerts
        alert: {
          red: '#DC2626',
          orange: '#EA580C',
          yellow: '#CA8A04'
        }
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px', 
        'lg': '16px',
        'xl': '24px'
      },
      spacing: {
        'xs': '4px',
        'sm': '8px', 
        'md': '16px',
        'lg': '24px',
        'xl': '32px'
      },
      boxShadow: {
        'card': '0 8px 24px rgba(0,0,0,0.08)',
        'soft': '0 4px 12px rgba(0,0,0,0.05)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}


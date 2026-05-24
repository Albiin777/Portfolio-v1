/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        greattimes: ['"Times New Roman"', 'Times', 'serif'],
        mono: ['Space Mono', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        accent: '#FFB000',
        'accent-dim': 'rgba(255, 176, 0, 0.4)',
        'bg-dark': '#050505',
        'bg-light': '#111111',
        'panel': '#0B0B0B',
        white: '#F5F5F5',
      },
      boxShadow: {
        'mech-outer': '0 0 0 1px rgba(255,255,255,0.05), inset 0 20px 40px -10px rgba(0,0,0,0.8), 0 30px 60px -15px rgba(0,0,0,0.9), inset 0 0 0 4px rgba(255,255,255,0.02)',
        'mech-inner': 'inset 0 10px 20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.5)',
        'mech-ring': 'inset 0 0 20px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 15px rgba(0,0,0,0.5)',
        'mech-glow': '0 0 15px rgba(255, 176, 0, 0.5), inset 0 0 10px rgba(255, 176, 0, 0.3)',
      },
      keyframes: {
        twinkle: {
          '0%': { opacity: '0.1', transform: 'scale(0.8)' },
          '100%': { opacity: '0.7', transform: 'scale(1.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        twinkle: 'twinkle var(--dur, 3s) ease-in-out infinite alternate',
        slideUp: 'slideUp 0.6s cubic-bezier(0.76, 0, 0.24, 1) forwards',
        fadeIn: 'fadeIn 0.8s ease forwards',
      }
    },
  },
  plugins: [],
}

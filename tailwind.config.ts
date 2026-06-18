import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oled: '#000000',
        panel: '#0a0a0a',
        surface: '#111111',
        border: '#1e1e1e',
        accent: '#00ff88',
        'accent-dim': '#00cc6a',
        'accent-glow': 'rgba(0,255,136,0.15)',
        amber: '#ffb300',
        'amber-dim': '#cc8e00',
        red: '#ff3333',
        'red-dim': '#cc0000',
        cyan: '#00d4ff',
        muted: '#444444',
        ghost: '#888888',
        display: '#e8e8e8',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        display: ['Orbitron', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0,255,136,0.3)',
        'glow-amber': '0 0 20px rgba(255,179,0,0.3)',
        'glow-red': '0 0 20px rgba(255,51,51,0.3)',
        'glow-cyan': '0 0 20px rgba(0,212,255,0.3)',
        panel: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        sweep: 'sweep 0.1s linear infinite',
        pulse_slow: 'pulse 3s ease-in-out infinite',
        flicker: 'flicker 0.15s ease-in-out infinite',
        scan: 'scan 2s linear infinite',
        'led-blink': 'led-blink 0.5s ease-in-out infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'scaleX(0)', opacity: '1' },
          '100%': { transform: 'scaleX(1)', opacity: '0' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'led-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

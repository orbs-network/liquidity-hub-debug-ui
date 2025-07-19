/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"];
export const content = ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"];
export const theme = {
  extend: {
    keyframes: {
      'dialog-in-center': {
        '0%': {
          opacity: '0',
          transform: 'translate(-50%, -40%) scale(0.95)',
        },
        '100%': {
          opacity: '1',
          transform: 'translate(-50%, -50%) scale(1)',
        },
      },
      'dialog-out-center': {
        '0%': {
          opacity: '1',
          transform: 'translate(-50%, -50%) scale(1)',
        },
        '100%': {
          opacity: '0',
          transform: 'translate(-50%, -40%) scale(0.95)',
        },
      },
    },
    animation: {
      'dialog-in': 'dialog-in-center 200ms ease-out forwards',
      'dialog-out': 'dialog-out-center 200ms ease-in forwards',
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    colors: {
      background: 'var(--background)',
      foreground: 'hsl(var(--foreground))',
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },
      primary: {
        DEFAULT: 'var(--primary)',
        foreground: 'var(--primary-foreground)'
      },
      secondary: {
        DEFAULT: 'var(--secondary)',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      muted: {
        DEFAULT: 'var(--muted)',
        foreground: 'hsl(var(--muted-foreground))'
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))'
      },
      destructive: {
        DEFAULT: 'var(--destructive)',
        foreground: 'var(--destructive-foreground)'
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      "dialog-background": "var(--dialog-background)",
      "dialog-border": "var(--dialog-border)",
      "card-bg": "var(--card-bg)",
      chart: {
        '1': 'hsl(var(--chart-1))',
        '2': 'hsl(var(--chart-2))',
        '3': 'hsl(var(--chart-3))',
        '4': 'hsl(var(--chart-4))',
        '5': 'hsl(var(--chart-5))'
      },
      success: 'hsl(var(--success))'
    }
  }
};
export const plugins = [
  require("tailwindcss-animate"), // required by shadcn UI
];
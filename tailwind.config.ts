const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      screens: {
        "xs": "420px",
        "2xl": "1400px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "in": {
          from: { opacity: 0, transform: "translateY(-10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "in-down": {
          from: { opacity: 0, transform: "translateY(-10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "in": "in 0.3s ease 0.15s both",
        "in-down": "in-down 0.3s ease",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities, theme, e, variants }: any) {
      // Base styles for the scrollbar customization
      const baseScrollbarStyles = {
        '.scrollbar': {
          '--scrollbar-width': '0.25rem', // Default width value
          '&::-webkit-scrollbar': {
            width: 'var(--scrollbar-width)',
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 'var(--scrollbar-radius, 0.25rem)',
          },
        },
      };

      // Generate scrollbar width utilities
      const scrollbarWidthUtilities = Object.entries(theme('spacing')).map(([key, value]) => {
        return {
          [`.scrollbar-w-${e(key)}`]: {
            '--scrollbar-width': value,
          },
        };
      });

      // Generate scrollbar radius utilities
      const scrollbarRadiusUtilities = Object.entries(theme('borderRadius')).map(([key, value]) => {
        return {
          [`.scrollbar-radius-${e(key)}`]: {
            '--scrollbar-radius': value,
          },
        };
      });

      // Combine and add all utilities
      addUtilities([
        baseScrollbarStyles,
        ...Object.values(scrollbarWidthUtilities),
        ...Object.values(scrollbarRadiusUtilities),
      ], {
        variants: ['responsive'], // Apply the responsive variant to all custom utilities
      });
    }),
  ],
}
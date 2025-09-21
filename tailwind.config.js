/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/**/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			// Chakra UI Brand Colors
  			brand: {
  				100: "#E9E3FF",
  				200: "#422AFB",
  				300: "#422AFB",
  				400: "#7551FF",
  				500: "#422AFB",
  				600: "#3311DB",
  				700: "#02044A",
  				800: "#190793",
  				900: "#11047A",
  			},
  			brandScheme: {
  				100: "#E9E3FF",
  				200: "#7551FF",
  				300: "#7551FF",
  				400: "#7551FF",
  				500: "#422AFB",
  				600: "#3311DB",
  				700: "#02044A",
  				800: "#190793",
  				900: "#02044A",
  			},
  			brandTabs: {
  				100: "#E9E3FF",
  				200: "#422AFB",
  				300: "#422AFB",
  				400: "#422AFB",
  				500: "#422AFB",
  				600: "#3311DB",
  				700: "#02044A",
  				800: "#190793",
  				900: "#02044A",
  			},
  			secondaryGray: {
  				100: "#E0E5F2",
  				200: "#E1E9F8",
  				300: "#F4F7FE",
  				400: "#E9EDF7",
  				500: "#8F9BBA",
  				600: "#A3AED0",
  				700: "#707EAE",
  				800: "#707EAE",
  				900: "#1B2559",
  			},
  			navy: {
  				50: "#d0dcfb",
  				100: "#aac0fe",
  				200: "#a3b9f8",
  				300: "#728fea",
  				400: "#3652ba",
  				500: "#1b3bbb",
  				600: "#24388a",
  				700: "#1B254B",
  				800: "#111c44",
  				900: "#0b1437",
  			},
  			// CSS Variable based colors
  			background: 'hsl(var(--background))',
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
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}


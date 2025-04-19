import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		fontSize: {
			'xs': '0.825rem',
			'sm': '0.935rem',
			'base': '1.1rem',
			'lg': '1.21rem',
			'xl': '1.32rem',
			'2xl': '1.65rem',
			'3xl': '1.98rem',
			'4xl': '2.42rem',
			'5xl': '3.08rem',
			'6xl': '3.85rem',
		},
		spacing: {
			'0': '0px',
			'1': '0.275rem',
			'2': '0.55rem',
			'3': '0.825rem',
			'4': '1.1rem',
			'5': '1.375rem',
			'6': '1.65rem',
			'8': '2.2rem',
			'10': '2.75rem',
			'12': '3.3rem',
			'16': '4.4rem',
			'20': '5.5rem',
			'24': '6.6rem',
			'32': '8.8rem',
			'40': '11rem',
			'48': '13.2rem',
			'56': '15.4rem',
			'64': '17.6rem',
		},
		extend: {
			animation: {
				loader: "loader 500ms linear infinite",
				"bounce-slow": "smallBounce 3s ease-in-out infinite",
				"border-flow": "borderFlow 2s linear infinite",
				"energy-flow": "energyFlow 2s linear infinite",
				"pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"pulse-very-slow": "pulse-very-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"pulse-fast": "pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				montserrat: ["var(--font-montserrat)"],
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				groq: {
					DEFAULT: "#F55036",
					foreground: "#fff",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},
			keyframes: {
				loader: {
					"0%": { left: "0", width: "0" },
					"50%": { left: "0", width: "100%" },
					"100%": { left: "100%", width: "0" },
				},
				smallBounce: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				borderFlow: {
					"0%": { backgroundPosition: "0% 0%" },
					"100%": { backgroundPosition: "100% 0%" },
				},
				energyFlow: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(100%)" },
				},
				energyFlowReverse: {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(-100%)" },
				},
				energyFlowDown: {
					"0%": { transform: "translateY(-100%)" },
					"100%": { transform: "translateY(100%)" },
				},
				energyFlowUp: {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(-100%)" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				"fade-in": "fade-in 0.2s ease-out",
				"energy-flow": "energyFlow 2s linear infinite",
				"energy-flow-slow": "energyFlow 4s linear infinite",
				"energy-flow-reverse": "energyFlowReverse 2s linear infinite",
				"energy-flow-down": "energyFlowDown 2s linear infinite",
				"energy-flow-up": "energyFlowUp 2s linear infinite",
				"bounce-slow": "smallBounce 3s ease-in-out infinite",
				"pulse-opacity": "pulse 4s ease-in-out infinite",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			addUtilities({
				'.scrollbar-hide': {
					'scrollbarWidth': 'none',
					'-ms-overflow-style': 'none',
					'&::-webkit-scrollbar': {
						'display': 'none'
					}
				}
			});
		}
	],
};
export default config;

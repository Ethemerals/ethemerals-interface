const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		screens: {
			xs: '400px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
		extend: {
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},
				receiptOff: {
					'0%': { opacity: 1 },
					'100%': { opacity: 0 },
				},
			},
			animation: {
				wiggle: 'wiggle 1s ease-in-out infinite',
				receiptOff: 'receiptOff 2s ease-out forwards',
			},
			fontFamily: {
				sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
	future: {
		purgeLayersByDefault: true,
	},
};

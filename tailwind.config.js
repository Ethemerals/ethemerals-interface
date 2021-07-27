const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'

	theme: {
		screens: {
			xs: { max: '575px' }, // Mobile (iPhone 3 - iPhone XS Max).
			sm: { min: '576px' }, // Mobile (matches max: iPhone 11 Pro Max landscape @ 896px).
			md: { min: '898px' }, // Tablet (matches max: iPad Pro @ 1112px).
			lg: { min: '1200px' }, // Desktop smallest.
			xl: { min: '1159px' }, // Desktop wide.
			xxl: { min: '1359px' }, // Desktop widescreen.
		},
		extend: {
			opacity: ['disabled'],
			spacing: {
				'10px': '10px',
				74: '74px',
				90: '90px',
				420: '420px',
				400: '400px',
				600: '600px',
			},
			maxWidth: {
				420: '420px',
			},
			maxHeight: {
				'90vh': '90vh',
			},
			keyframes: {
				fadeOn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				fadeOff: {
					'0%': { opacity: 1 },
					'100%': { opacity: 0 },
				},
				receiptOff: {
					'0%': { opacity: 1 },
					'100%': { opacity: 0 },
				},
				bounceSlow: {
					'0%, 100%': { transform: 'translate(0px,0px)' },
					'50%': { transform: 'translate(0px,5px)' },
				},
			},
			animation: {
				fadeOnFast: 'fadeOn 0.2s ease-in-out forwards',
				fadeOffFast: 'fadeOff 0.2s ease-out forwards',
				fadeOffSlow: 'fadeOff 2s ease-out forwards',
				bounceSlow: 'bounceSlow 5s ease-in-out infinite',
				'spin-slow': 'spin 3s linear infinite',
			},
			colors: {
				customLightBlue: {
					DEFAULT: '#77D9E2',
				},
				custom: {
					aquaDark: '#003A37',
				},
				brandColor: {
					DEFAULT: '#F900D1',
					purple: '#9C00D3',
					dark: '#934E9E',
					pale: '#FF66D4',
					black: 'rgba(14,21,28,1)',
					blue: '#def2ff',
				},
			},
			fontFamily: {
				ubuntu: ['Ubuntu', ...defaultTheme.fontFamily.sans],
				sans: ['Noto Sans SC', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	variants: {
		extend: {
			backgroundImage: ['hover', 'focus'],
		},
	},
	plugins: [],
	future: {
		purgeLayersByDefault: true,
	},
};

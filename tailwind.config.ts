import type { Config } from 'tailwindcss';

export default {
    darkMode: ['class'],
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	screens: {
    		mobile: '350px',
    		'mid-mobile': '400px',
    		phone: '450px',
    		'mid-phone': '500px',
    		'mid-phone-wide': '550px',
    		wide: '600px',
    		tablet: '650px',
    		'mid-tablet-small': '700px',
    		'mid-column': '750px',
    		'mid-tablet': '800px',
    		'two-column': '1000px',
    		laptop: '1280px'
    	},
    	extend: {
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		colors: {
    			primary: '#ed3a5f',
    			'primary-light': '#f16985',
    			'primary-dark': '#e0143e',
    			'primary-very-dark': '#b81133',
    			'primary-pink': '#FF96AC',
    			'primary-pink-light': '#FFA4B7',
    			background: '#FFFDF5',
    			'background-secondary': '#FAF8EF',
    			'background-dark': '#EFECDE',
    			'background-light': '#FFF8DE',
    			'background-very-light': '#fffbec'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

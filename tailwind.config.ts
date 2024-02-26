import type { Config } from 'tailwindcss';

const config = {
    darkMode: ['class'],
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        screens: {
            mobile: '350px',
            mablet: '500px',
            tablet: '650px',
            taptop: '820px',
            laptop: '960px',
            desktop: '1280px',
        },
        extend: {
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
            colors: {
                primary: '#ed3a5f',
                'primary-light': '#f16985',
                'primary-dark': '#e0143e',
                'primary-pink': '#FF96AC',
                'primary-pink-light': '#FFA4B7',

                background: '#FFFDF5',
                'background-secondary': '#FAF8EF',
                'background-dark': '#EFECDE',
                'background-light': '#FFF8DE',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;

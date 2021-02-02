const colors = require('tailwindcss/colors')

module.exports = {
    theme: {
        colors: {
            gray: colors.trueGray,
            red: colors.red,
            white: colors.white,
            'light-blue': colors.lightBlue
        },
        extend: {
            keyframes: {
                'tw-pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 }
                }
            },
            animation: {
                'tw-pulse': 'tw-pulse 1s ease-in-out infinite',
            },
            colors: {
                'accent': '#5b749b',
                'accent-lighter': '#7e93b3',
                'accent-darker': '#455876'
            },
            height: {
                page: 'calc(100vw * 1.59)',
                '1/2': '50%',
            },
            spacing: {
                '7/5': '141.5094339622642%',
                'safe-top': 'calc(env(safe-area-inset-top) + theme(spacing.2))',
                'safe-top-bar': 'calc(env(safe-area-inset-top) + theme(spacing.12))',
                'safe-bottom': 'calc(env(safe-area-inset-bottom) + theme(spacing.2))',
                'safe-bottom-scroll': 'calc(env(safe-area-inset-bottom) + 5rem)'
            },
            gridTemplateColumns: {
                '16': 'repeat(16, minmax(0, 1fr))',
            },
            maxWidth: {
                '1/2': '50%',
            }
        },
        container: {
            center: true,
        },
    },
    variants: {
        backgroundColor: ['dark', 'responsive', 'hover', 'focus', 'disabled'],
        textColor: ['dark', 'responsive', 'hover', 'focus', 'disabled'],
        divideColor: ['dark']
    },
    plugins: [],
    darkMode: 'media',
    purge: false,
}
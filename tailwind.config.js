/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary-muted": "#ffcc33",
                danger: "#EF4444",

            },
        },
    },
    plugins: [require("daisyui")],

    daisyui: {
        themes: [
            {
                emerald: {
                    ...require("daisyui/src/theming/themes")["emerald"],
                    primary: "#009ca7",
                    secondary: "#00d5d3",
                    "base-100": "#F4F4F4",
                    "base-200": "#dcdcdc",
                    "base-300": "#ffffff",
                    "--primary-muted": "#ffffff",

                },
            },
            {
                dim: {
                    ...require("daisyui/src/theming/themes")["dim"],
                    primary: "#009ca7",
                    secondary: "#00a1a0",
                    "base-200": "#242b34",
                    "--primary-muted": "338 83% 66%",

                },
            },

        ]
    },
}


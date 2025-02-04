import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: '#1890ff',
                white: '#ffffff',
                gray: {
                    DEFAULT: "#E6EBF1",
                    dark: "#122031",
                    1: "#F9FAFB",
                    2: "#F3F4F6",
                    3: "#E5E7EB",
                    4: "#D1D5DB",
                    5: "#9CA3AF",
                    6: "#6B7280",
                    7: "#374151",
                },
            },
            zIndex: {
                999999: "999999",
                99999: "99999",
                9999: "9999",
                999: "999",
                99: "99",
                9: "9",
                1: "1",
            },
            fontFamily: {
                poppins: ['var(--font-poppins)', 'sans-serif']
            }
        }
    },
    plugins: [],
};
export default config;

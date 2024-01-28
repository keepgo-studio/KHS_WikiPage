import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "prime-blue": "#3080FF",
        "deem": "#1E2A3B",
        "prime-gray": "#AEB5BE",
        "light-gray": "#F1F5F9",
        "violet": "#818CF8"
      },
      boxShadow: {
        "sh1": "0px 1px 6px 5px rgba(0, 0, 0, 0.10)",
        "sh2": "0px 1px 6px 3px rgba(0, 0, 0, 0.08)"
      },
      keyframes: {
        "loading-spinner-rotate": {
          "100%": { transform: "rotate(360deg)" }
        },
        "loading-spinner-dash": {
          "0%": {
            "stroke-dasharray": "1, 200",
            "stroke-dashoffset": "0",
          },
          "50%": {
            "stroke-dasharray": "89, 200",
            "stroke-dashoffset": "-35px",
          },
          "100%": {
            "stroke-dasharray": "89, 200",
            "stroke-dashoffset": "-124px",
          }
        },
        "loading-spinner-color": {
          "100%, 0%": { stroke: "#7d0fe6" },
          "40%": { stroke: "#28dcd7" },
          "66%": { stroke: "#ff6100" },
          "80%, 90%": { stroke: "#7d0fe6" }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;

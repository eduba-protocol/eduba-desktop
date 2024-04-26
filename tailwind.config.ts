import daisyUi from "daisyui";
import typeography from "@tailwindcss/typography";
import { Config } from "tailwindcss/types/config";

const config: Config = {
  content: ["./src/index.html", "./src/renderer/**/*.{html,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        custom1: {
          primary: "#db9a32",
          secondary: "#4ac924",
          accent: "#87edbd",
          neutral: "#241e24",
          "base-100": "#ffffff",
          info: "#8eb0e6",
          success: "#66eaaf",
          warning: "#f3ce5e",
          error: "#ea618d",
        },
        custom2: {
          primary: "#7eacfc",
          secondary: "#ea7d10",
          accent: "#037199",
          neutral: "#1d191f",
          "base-100": "#efeaf6",
          info: "#9ecceb",
          success: "#2ed69b",
          warning: "#eca33c",
          error: "#e75f71",
        },
        custom3: {
          primary: "#ac96dd",
          secondary: "#bbcbf7",
          accent: "#f6bbf9",
          neutral: "#293038",
          "base-100": "#f3f2f3",
          info: "#559bf1",
          success: "#186253",
          warning: "#9d6a0b",
          error: "#f77864",
        },
      },
    ],
  },
  plugins: [typeography, daisyUi]
};

export default config;

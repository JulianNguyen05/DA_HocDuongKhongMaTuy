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
        brand: {
          green: {
            light: "#EBF9EF",
            DEFAULT: "#37C35F",
            dark: "#2DA650",
          },

          deep: "#0F2916",

          cream: {
            DEFAULT: "#FBFBF2",
            dark: "#F2F2E2",
          },

          accent: "#D4A373",

          neutral: {
            heading: "#1A1C19",
            body: "#444941",
            muted: "#8C9288",
          },
        },

        status: {
          error: "#E53E3E",
          warning: "#F6AD55",
          info: "#4299E1",
        },
      },

      boxShadow: {
        "glow-red": "0 0 15px rgba(229, 62, 62, 0.5)",
        glass: "0 4px 30px rgba(0,0,0,0.05)",

        /* NEW */
        glow: "0 0 20px rgba(55,195,95,0.45)",
        navbar: "0 6px 30px rgba(0,0,0,0.08)",
      },

      animation: {
        float: "float 3s ease-in-out infinite",
        fade: "fadeIn 0.6s ease forwards",
        slideDown: "slideDown 0.3s ease",
      },

      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },

        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        slideDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
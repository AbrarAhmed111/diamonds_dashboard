import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter-tight)", "Inter Tight", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        blue: {
          25: "#DDECFB",
          50: "#EDF6FF",
          100: "#B6D6F7",
          200: "#92C2F3",
          300: "#60A6ED",
          400: "#4195E9",
          500: "#127AE4",
          600: "#106FCF",
          700: "#0D57A2",
          800: "#0A437D",
          900: "#083360",
        },
        green: {
          50: "#F9FEF4",
          100: "#ECFBDB",
          200: "#E3F9CA",
          300: "#D6F6B2",
          400: "#CEF5A3",
          500: "#C2F28C",
          600: "#B1DC7F",
          700: "#8AAC63",
          800: "#6B854D",
          900: "#335C07",
        },
        neutral: {
          50: "#FFFFFF",
          100: "#FEFEFE",
          200: "#FDFDFD",
          300: "#FCFCFC",
          400: "#F6F6F8",
          500: "#E5E5E5",
          600: "#B3B3B3",
          700: "#8B8B8B",
          800: "#6A6A6A",
          900: "#1F1F1F",
        },
        ink: {
          DEFAULT: "#0D0D0D",
          muted: "#6A6A6A",
          subtle: "#8B8B8B",
        },
        sentiment: {
          DEFAULT: "rgb(var(--sentiment-rgb) / <alpha-value>)",
          soft: "rgb(var(--sentiment-soft-rgb) / <alpha-value>)",
          ink: "rgb(var(--sentiment-ink-rgb) / <alpha-value>)",
        },
        chart: {
          DEFAULT: "rgb(var(--chart-rgb) / <alpha-value>)",
          soft: "rgb(var(--chart-soft-rgb) / <alpha-value>)",
        },
        chip: {
          DEFAULT: "rgb(var(--chip-rgb) / <alpha-value>)",
          ink: "rgb(var(--chip-ink-rgb) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          canvas: "#FAFBFF",
          muted: "#F6F6F8",
          sunken: "#F2F4F8",
        },
        positive: {
          50: "#F1FBE5",
          100: "#E3F9CA",
          500: "#8AAC63",
          700: "#335C07",
        },
        negative: {
          50: "#FFF1EC",
          100: "#FFD9CC",
          500: "#E26A45",
          700: "#9C3713",
        },
        warning: {
          50: "#FFF8E6",
          100: "#FFF1DA",
          500: "#D89B14",
          700: "#B8741F",
        },
        indigo: {
          100: "#E2E5F4",
          600: "#5A6BB8",
        },
        purple: {
          100: "#EAE0F5",
          600: "#7B5BB6",
        },
        slate: {
          100: "#E5EBF2",
        },
        coral: {
          100: "#FBE6D8",
          500: "#F08F47",
        },
      },
      borderRadius: {
        card: "10px",
        icon: "8px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "22px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.04)",
        soft: "0 1px 0 rgba(15, 23, 42, 0.04)",
        focus: "0 0 0 3px rgba(18, 122, 228, 0.25)",
      },
      fontSize: {
        h1: ["68px", { lineHeight: "80px", letterSpacing: "0" }],
        h2: ["34px", { lineHeight: "40px", letterSpacing: "0" }],
        h3: ["28px", { lineHeight: "32px", letterSpacing: "0" }],
        h4: ["22px", { lineHeight: "28px", letterSpacing: "0" }],
        body: ["17px", { lineHeight: "24px", letterSpacing: "0" }],
        small: ["14px", { lineHeight: "20px", letterSpacing: "0" }],
        caption: ["12px", { lineHeight: "16px", letterSpacing: "0" }],
        "btn-lg": ["20px", { lineHeight: "24px", letterSpacing: "0" }],
        "btn-sm": ["16px", { lineHeight: "24px", letterSpacing: "0" }],
        "h1-m": ["34px", { lineHeight: "40px", letterSpacing: "0" }],
        "h2-m": ["28px", { lineHeight: "32px", letterSpacing: "0" }],
        "h3-m": ["22px", { lineHeight: "28px", letterSpacing: "0" }],
        "h4-m": ["18px", { lineHeight: "24px", letterSpacing: "0" }],
        "body-m": ["16px", { lineHeight: "24px", letterSpacing: "0" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      transitionDuration: {
        fast: "120ms",
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

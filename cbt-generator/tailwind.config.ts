import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B1F27",
        surface: "#232833",
        surfaceLine: "#2E3644",
        paper: "#F7F5EF",
        paperLine: "#DAD5C6",
        marker: "#F5C518",
        markerDark: "#C79E0A",
        correct: "#4ADE80",
        textPaper: "#1B1F27",
        textInk: "#ECEAE3",
        muted: "#9AA1AE",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

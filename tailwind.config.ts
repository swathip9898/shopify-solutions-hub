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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "#318CE7",
          primaryHover: "#2478CC",
          secondary: "#70B7FF",
          bg: "#F8FBFF",
          card: "#FFFFFF",
          highlight: "#EAF5FF",
          heading: "#25364A",
          border: "#E3EDF7",
        },
      },
    },
  },
  plugins: [],
};
export default config;

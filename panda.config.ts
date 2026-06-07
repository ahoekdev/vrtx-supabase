import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

const bodyTypography = {
  fontFamily:
    '"Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif',
};

const headingTypography = {
  fontWeight: "bold",
};

const globalCss = defineGlobalStyles({
  body: {
    ...bodyTypography,
  },
  h1: {
    fontSize: "2rem",
    ...headingTypography,
  },
  h2: {
    fontSize: "1.5rem",
    ...headingTypography,
  },
  h3: {
    fontSize: "1.25rem",
    ...headingTypography,
  },
});

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  eject: true,
  globalCss,
  include: ["./src/**/*.{ts,tsx,js,jsx,astro}"],
  presets: ["@pandacss/preset-base"],
  utilities: {
    color: {
      values: "colors",
    },
  },
  theme: {
    tokens: {
      colors: {},
    },
  },
  outdir: "styled-system",
});

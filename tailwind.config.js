module.exports = {
  purge: [
    "./src/**/*.html",
    "./src/**/*.tsx",
    "./content/**/*.tsx",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {},
  },
  variants: {
    textColor: ["responsive", "hover", "focus", "group-hover"],
  },
  plugins: [],
};

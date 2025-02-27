const { dirname } = require("path");
const { FlatCompat } = require("@eslint/eslintrc");

// __dirname is available by default in CommonJS
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

module.exports = eslintConfig;

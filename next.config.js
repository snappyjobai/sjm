// Using CommonJS syntax
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.join(__dirname, "components"),
      "@data": path.join(__dirname, "data"),
    };
    return config;
  },
};

module.exports = nextConfig;

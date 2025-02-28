// Using CommonJS syntax
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx"],
  // Either transpile OR set as external, not both
  // Let's set them as external since they're server-side packages
  serverExternalPackages: ["mysql2", "bcryptjs", "jsonwebtoken", "stripe"],
  webpack: (config, { isServer }) => {
    // Keep your existing aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.join(__dirname, "components"),
      "@data": path.join(__dirname, "data"),
    };

    // Add experimental features for ES modules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // Handle ES module syntax in API routes
    if (isServer) {
      config.module.rules.push({
        test: /pages\/api\/.*\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      });
    }

    return config;
  },
};

module.exports = nextConfig;

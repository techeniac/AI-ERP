import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  {
    settings: {
      react: { version: "detect" },
    },
    ignores: [".next/**", "node_modules/**"],
  },
];

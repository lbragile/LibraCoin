module.exports = {
  env: { browser: true, es6: true, commonjs: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest-dom/recommended",
    "plugin:testing-library/react"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 12 },
  plugins: ["react", "@typescript-eslint", "testing-library", "jest-dom"],
  rules: {},
  settings: { react: { version: "detect" } },
  ignorePatterns: ["dist/*.js"]
};

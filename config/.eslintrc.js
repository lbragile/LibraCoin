module.exports = {
  env: { browser: true, es6: true, commonjs: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest-dom/recommended",
    "plugin:react-hooks/recommended",
    "plugin:testing-library/react",
    "plugin:jest/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 12 },
  plugins: ["react", "@typescript-eslint", "testing-library", "jest", "jest-dom"],
  rules: {
    "default-case": "warn"
  },
  settings: { react: { version: "detect" } }
};

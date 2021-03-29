module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: [
    "build/",
    "node_modules/",
    // ESLint ignores hidden files by default, add negative ignore patterns so
    // that they get linted as well.
    "!.prettierrc.js",
  ],
};

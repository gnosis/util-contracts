module.exports = {
  bracketSpacing: true,
  trailingComma: "all",
  printWidth: 100,
  overrides: [
    // The Solidity prettier plugin overrides the bracket spacing options
    // globally. So restore the default for the global prettier settings and
    // set what the plugin wants just for Solidity files.
    {
      files: "*.sol",
      options: {
        bracketSpacing: false,
      },
    },
  ],
};

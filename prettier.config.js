module.exports = {
  printWidth: 80,
  tabWidth: 4,
  parser: "typescript",
  overrides: [
    {
      files: "*.less",
      options: {
        parser: "less"
      }
    }
  ]
};

module.exports = {
  presets: [
    [
      "@babel/preset-typescript",
      { allowNamespaces: true, allowDeclareFields: true },
    ],
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: true }],
    ["@babel/plugin-proposal-optional-chaining", { loose: true }],
    "@babel/plugin-proposal-logical-assignment-operators",
  ],
};

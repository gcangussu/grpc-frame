/**
 * Babel is only used to transpile TypeScript tests to Jest.
 *
 * Babel don't do typechecking. Use `yarn build-tests` to typecheck tests.
 */
module.exports = {
  test: "packages/*/test/**/*.ts",
  exclude: [/* don't import source files */ "packages/*/src/"],
  presets: ["@babel/preset-typescript"],
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: true }],
    ["@babel/plugin-proposal-optional-chaining", { loose: true }],
    "@babel/plugin-proposal-logical-assignment-operators",
  ],
};

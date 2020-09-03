// eslint-disable-next-line node/no-process-env
const isQuick = process.env.LINT_QUICK !== "false";

const tsProject = ["./packages/*/tsconfig-cjs.json", "./tsconfig-test.json"];

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "@gcangussu/eslint-config",
    "@gcangussu/eslint-config/node",
    ...(isQuick ? ["@gcangussu/eslint-config/quick"] : []),
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: isQuick ? null : tsProject,
  },
  settings: {
    "import/resolver": { typescript: { project: tsProject } },
  },
  overrides: [
    {
      files: ["packages/*/test/**/*.ts"],
      extends: "@gcangussu/eslint-config/jest",
      rules: {
        "@typescript-eslint/no-unsafe-assignment": "off",

        "import/no-extraneous-dependencies": [
          "error",
          { packageDir: __dirname },
        ],
      },
    },
  ],
};

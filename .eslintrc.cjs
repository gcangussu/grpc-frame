// eslint-disable-next-line node/no-process-env
const isQuick = process.env.LINT_QUICK !== "false";

const tsProject = ["./packages/*/tsconfig-cjs.json", "./tsconfig-test.json"];

module.exports = {
  root: true,
  extends: [
    "@gcangussu/eslint-config",
    "@gcangussu/eslint-config/node",
    ...(isQuick ? ["@gcangussu/eslint-config/quick"] : []),
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: tsProject,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: tsProject,
      },
    },
  },
};

/* eslint-disable @typescript-eslint/no-var-requires */
const { IntrospectionJSON } = require("skyhook-graphql-sdk");

module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    // Airbnb Typescript eslint from https://www.npmjs.com/package/eslint-config-airbnb-typescript
    "airbnb-base",
    "airbnb-typescript/base",
    // Standard eslint & typescript-eslint recommended
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // Prettier added using default settings from https://github.com/prettier/eslint-plugin-prettier
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
    ecmaVersion: 8,
    sourceType: "module",
  },
  plugins: [
    // Enable graphql linting to check against our schema - https://github.com/apollographql/eslint-plugin-graphql
    "graphql",
    "@typescript-eslint",
  ],
  root: true,
  // As well as some Skyhook-specific preferences, the most intensive rules are disabled for performance reasons. This
  // reduces the linting time dramatically and thus improves the developer experience.
  rules: {
    "@typescript-eslint/no-implied-eval": "off", // Disabled for performance
    "graphql/template-strings": [
      "error",
      {
        env: "literal",
        schemaJson: IntrospectionJSON,
      },
    ],
    "import/no-cycle": "off", // Disabled for performance
    "import/no-extraneous-dependencies": "off", // Disabled for performance
    // Disable prefer default export as AWS Lambda will only run non-default exports (typically `handler`)
    "import/prefer-default-export": "off",
    // Console logging is only an issue on frontend (not backend) code due to imperfect browser support. For the backend
    // it's actually recommended as a quick way of getting logs from lambdas to Cloudwatch.
    "no-console": "off",
    // Using new side effects is a key design pattern of aws-cdk and used heavily for our infrastructure
    "no-new": "off",
    radix: "off", // Disabled for performance
  },
  ignorePatterns: ["graphqlOperations.ts"],
};

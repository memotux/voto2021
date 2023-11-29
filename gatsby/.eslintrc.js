module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "arrow-body-style": [
      "error",
      "as-needed",
      { requireReturnForObjectLiteral: true },
    ],
    "no-unused-expressions": [
      "error",
      {
        allowTaggedTemplates: true,
      },
    ],
    "consistent-return": ["error"],
    "filenames/match-regex": ["error", "^[a-z-\\d\\.]+$", true],
    "no-console": "off",
    "no-inner-declarations": "off",
    "prettier/prettier": "error",
    quotes: ["error", "backtick"],
    "react/display-name": "off",
    "react/jsx-key": "warn",
    "react/no-unescaped-entities": "off",
    "react/prop-types": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
  settings: {
    react: {
      createClass: "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: "React", // Pragma to use, default to "React"
      version: "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      flowVersion: "0.53", // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      { property: "freeze", object: "Object" },
      { property: "myFavoriteWrapper" },
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      { name: "Link", linkAttribute: "to" },
    ],
  },
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint/eslint-plugin"],
      rules: {
        ...TSEslint.configs.recommended.rules,
        // We should absolutely avoid using ts-ignore, but it's not always possible.
        // particular when a dependencies types are incorrect.
        "@typescript-eslint/ban-ts-ignore": "warn",
        // This rule is great. It helps us not throw on types for areas that are
        // easily inferrable. However we have a desire to have all function inputs
        // and outputs declaratively typed. So this let's us ignore the parameters
        // inferrable lint.
        "@typescript-eslint/no-inferrable-types": [
          "error",
          { ignoreParameters: true },
        ],
        // This rule tries to ensure we use camelCase for all variables, properties
        // functions, etc. However, it is not always possible to ensure properties
        // are camelCase. Specifically we have `node.__gatsby_resolve` which breaks
        // this rule. This allows properties to be whatever they need to be.
        "@typescript-eslint/camelcase": ["error", { properties: "never" }],
        // This rule tries to prevent using `require()`. However in node code,
        // there are times where this makes sense. And it specifically is causing
        // problems in our tests where we often want this functionality for module
        // mocking. At this point it's easier to have it off and just encourage
        // using top-level imports via code reviews.
        "@typescript-eslint/no-var-requires": "off",
        // This rule ensures that typescript types do not have semicolons
        // at the end of their lines, since our prettier setup is to have no semicolons
        // e.g.,
        // interface Foo {
        // -  baz: string;
        // +  baz: string
        // }
        "@typescript-eslint/member-delimiter-style": [
          "error",
          {
            multiline: {
              delimiter: "none",
            },
          },
        ],
        // This ensures all interfaces are named with an I as a prefix
        // e.g.,
        // interface IFoo {}
        "@typescript-eslint/interface-name-prefix": [
          "error",
          { prefixWithI: "always" },
        ],
        "@typescript-eslint/no-empty-function": "off",
        // This ensures that we always type the return type of functions
        // a high level focus of our TS setup is typing fn inputs and outputs.
        "@typescript-eslint/explicit-function-return-type": "error",
        // This forces us to use interfaces over types aliases for object definitions.
        // Type is still useful for opaque types
        // e.g.,
        // type UUID = string
        "@typescript-eslint/consistent-type-definitions": [
          "error",
          "interface",
        ],
        "@typescript-eslint/no-use-before-define": [
          "error",
          { functions: false },
        ],
        // Allows us to write unions like `type Foo = "baz" | "bar"`
        // otherwise eslint will want to switch the strings to backticks,
        // which then crashes the ts compiler
        quotes: "off",
        "@typescript-eslint/quotes": [
          2,
          "backtick",
          {
            avoidEscape: true,
          },
        ],
        // bump to @typescript-eslint/parser started showing Flow related errors in ts(x) files
        // so disabling them in .ts(x) files
        // "flowtype/no-types-missing-file-annotation": "off",
        "@typescript-eslint/array-type": ["error", { default: "generic" }],
      },
    },
  ],
}

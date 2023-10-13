module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:vue/essential", "prettier"],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    "vue/no-multiple-template-root": "off",
    "semi": [2, "always"],
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["Home", "About"],
      },
    ],
  },
};

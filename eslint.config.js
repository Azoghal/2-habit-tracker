import eslint from "@eslint/js";
// import typescript from "@typescript-eslint/eslint-plugin"
// import hooksPlugin from "eslint-plugin-react-hooks"

export default [
    eslint.configs.recommended,
    // typescript.configs.typescript,
    // prettier.configs.recommended,
    // {
    //     rules: {
    //     "@typescript-eslint/no-explicit-any": "off",
    //     "@typescript-eslint/no-empty-function": "off",
    //     "@typescript-eslint/no-unused-vars": [
    //         "error",
    //         {argsIgnorePattern: "^_", varsIgnorePattern: "^_"},
    //     ],
    //     "react-hooks/rules-of-hooks": "error",
    //     "react-hooks/exhaustive-deps": "error",
    //     },
    //     languageOptions: {
    //         parser: typescript.parser,
    //     },
    //     plugins: {
    //         "@typescript-eslint": typescript,
    //         "react-hooks": hooksPlugin,
    //     },
    // },
];

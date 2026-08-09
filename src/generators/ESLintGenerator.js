import { BaseGenerator } from "./BaseGenerator.js";

export class ESLintGenerator extends BaseGenerator {
  getFiles() {
    return {
      "eslint.config.js": this.buildConfig(),
    };
  };

  getDevDependencies() {
    const deps = {
      eslint: "^9.9.0",
      "@eslint/js": "^9.9.0",
    };  

    if(this.options.usePrettier){
      deps["eslint-config-prettier"] = "^9.1.0";
    }

    return deps;
  };

  getScripts() {
    return {
      lint: "eslint .",
    };
  };

  buildConfig() {
    return `import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
`;
  };
};
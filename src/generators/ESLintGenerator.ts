import { BaseGenerator } from "./baseGenerator.js";
import type { DependencyMap, FileMap, ScriptMap } from "../types.js";

export class ESLintGenerator extends BaseGenerator {
  override getFiles(): FileMap {
    return {
      "eslint.config.js": this.buildConfig(),
    };
  };

  override getDevDependencies(): DependencyMap {
    const deps: DependencyMap = {
      eslint: "^9.9.0",
      "@eslint/js": "^9.9.0",
    };  

    if(this.options.usePrettier){
      deps["eslint-config-prettier"] = "^9.1.0";
    }

    return deps;
  };

  override getScripts(): ScriptMap {
    return {
      lint: "eslint .",
    };
  };

  private buildConfig(): string {
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
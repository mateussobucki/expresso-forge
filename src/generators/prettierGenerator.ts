import { BaseGenerator } from "./baseGenerator.js";
import type { DependencyMap, FileMap, ScriptMap } from "../types.js";

export class PrettierGenerator extends BaseGenerator{
  override getFiles(): FileMap {
    return {
      ".prettierrc": this.buildPrettierConfig(),
      ".prettierignore": `node_modules\npackage-lock.json\n`
    };
  };

  override getDevDependencies(): DependencyMap {
    return {
      prettier: "^3.3.3",
    };
  }

  override getScripts(): ScriptMap {
    return {
      format: "prettier --write .",
    };
  }

  private buildPrettierConfig(): string {
    return JSON.stringify(
      {
        semi: true,
        singleQuote: true,
        trailingComma: "es5",
        printWidth: 80,
        tabWidth: 2,
      },
      null,
      2
    );
  }
}
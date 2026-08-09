import { BaseGenerator } from "./baseGenerator.js";

export class PrettierGenerator extends BaseGenerator{
  getFiles(){
    return {
      ".prettierrc": this.buildPrettierConfig(),
      ".prettierignore": `node_modules\npackage-lock.json\n`
    };
  };

  getDevDependencies() {
    return {
      prettier: "^3.3.3",
    };
  }

  getScripts() {
    return {
      format: "prettier --write .",
    };
  }

  buildPrettierConfig() {
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
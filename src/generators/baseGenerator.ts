import fs from "node:fs/promises";
import path from "node:path";
import type { DependencyMap, FileMap, ProjectOptions, ScriptMap } from "../types.js";

export abstract class BaseGenerator {
  constructor(
    protected readonly rootDir: string,
    protected readonly options: ProjectOptions,
  ) {}

  //Generate files following child classes methods
  async generate(): Promise<void> {
    const files = this.getFiles();
    for (const [relativePath, content] of Object.entries(files)) {
      await this.writeFile(relativePath, content);
    }
  }

  //Create files and dirs if they dont exist yet
  protected async writeFile(relativePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.rootDir, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  }

  //Load files in this format: filepath:content
  abstract getFiles(): FileMap;

  //Load dependencies for package.json
  getDependencies(): DependencyMap {
    return {};
  }

  //Load dev dependencies for package.json
  getDevDependencies(): DependencyMap {
    return {};
  }

  //Load scripts for package.json
  getScripts(): ScriptMap {
    return {};
  }
}

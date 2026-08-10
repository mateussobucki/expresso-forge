import fs from "fs/promises";
import path from "path";

export class BaseGenerator{
  constructor(rootDir, options){
    if(new.target === BaseGenerator){
      throw new Error("BaseGenerator is abstract and cannot be instantiated directly");
    };

    this.rootDir = rootDir;
    this.options = options;
  };

  //Standard generate
  async generate(){
    const files = this.getFiles();
    for(const [relativePath, content] of Object.entries(files)){
      await this.writeFile(relativePath, content);
    };
  };

  //Create files and dirs if they dont exist yet
  async writeFile(relativePath, content){
    const fullPath = path.join(this.rootDir, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  };

  //Load files in this format: filename:content
  async getFiles(){
    return {};
  };

  //Load dependencies for package.json
  async getDependencies(){
    return {};
  };

  //Load dev dependencies for package.json
  async getDevDependencies(){
    return {};
  };

  //Load scripts for package.json
  async getScripts(){
    return {};
  };
};
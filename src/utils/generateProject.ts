import fs from 'fs/promises';
import path from 'path';
import { validateProjectName } from './validateProjectName.js';
import type { DependencyMap, ProjectOptions, ScriptMap } from '../types.js';
import type { BaseGenerator } from '../generators/baseGenerator.js';
import { ServerGenerator } from '../generators/serverGenerator.js';
import { MongoModelGenerator } from '../generators/mongoGenerator.js';
import { PrismaPostgresGenerator } from '../generators/prismaPostgresGenerator.js';
import { AuthGenerator } from '../generators/authGenerator.js';
import { DockerGenerator } from '../generators/dockerGenerator.js';
import { ESLintGenerator } from '../generators/ESLintGenerator.js';
import { PrettierGenerator } from '../generators/prettierGenerator.js';

export async function generateProject(projectName: string, options: ProjectOptions): Promise<void> {
  await validateProjectName(projectName);
  if(options.useJWT && options.database === "none"){
    throw new Error("JWT authentication requires a database (MongoDB or PostgreSQL). Please select one.");
  }

  const rootDir = path.join(process.cwd(), projectName);
  const { database, useJWT } = options;
  
  const generators: BaseGenerator[] = [new ServerGenerator(rootDir, options)];

  if (options.database === "mongodb") generators.push(new MongoModelGenerator(rootDir, options));
  if (options.database === "postgres") generators.push(new PrismaPostgresGenerator(rootDir, options));
  if (options.useJWT) generators.push(new AuthGenerator(rootDir, options));
  if (options.useDocker) generators.push(new DockerGenerator(rootDir, options));
  if (options.useESLint) generators.push(new ESLintGenerator(rootDir, options));
  if (options.usePrettier) generators.push(new PrettierGenerator(rootDir, options));

  //CONFIGURE DEPENDENCIES
  const dependencies: DependencyMap = {
    express: "^4.19.2",
    dotenv: "^16.4.5",
  };
  const devDependencies: DependencyMap = {};
  const scripts: ScriptMap = {
    start: "node server.js",
    dev: "node --watch server.js",
  };

  for(const generator of generators){
    await generator.generate();
    Object.assign(dependencies, generator.getDependencies());
    Object.assign(devDependencies, generator.getDevDependencies());
    Object.assign(scripts, generator.getScripts());
  }

  //MOUNT PACKAGE.JSON
  const packageJson = {
    name: projectName,
    version: "1.0.0",
    type: "module",
    main: "server.js",
    scripts,
    dependencies,
    ...(Object.keys(devDependencies).length > 0 && { devDependencies }),
  };

  await fs.writeFile(
    path.join(rootDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
  
  //CREATE FILES NOT HANDLED BY GENERATORS

  //.env
  let envContent = "PORT=3000\n";
  if(database === "mongodb") envContent += "MONGO_URI=mongodb://localhost:27017/db-name\n";
  if(database === "postgres") envContent += "DATABASE_URL=postgresql://user:password@localhost:5432/dbname\n";
  if(useJWT) envContent += "JWT_SECRET=your_secret_key\n";
  await fs.writeFile(path.join(rootDir, ".env.example"), envContent);

  //gitignore
  await fs.writeFile(path.join(rootDir, ".gitignore"), "node_modules\n.env\n");
};

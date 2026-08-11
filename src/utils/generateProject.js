import fs from 'fs/promises';
import { version } from 'os';
import path from 'path';
import { start } from 'repl';
import { validateProjectName } from './validateProjectName.js';
import { ServerGenerator } from '../generators/serverGenerator.js';
import { MongoModelGenerator } from '../generators/mongoGenerator.js';
import { PostgresGenerator } from '../generators/postgresGenerator.js';
import { AuthGenerator } from '../generators/authGenerator.js';
import { DockerGenerator } from '../generators/dockerGenerator.js';
import { ESLintGenerator } from '../generators/ESLintGenerator.js';
import { PrettierGenerator } from '../generators/prettierGenerator.js';

export async function generateProject(projectName, options = {}){
  await validateProjectName(projectName);
  if(options.useJWT && options.database === "none"){
    throw new Error("JWT authentication requires a database (MongoDB or PostgreSQL). Please select one.");
  }

  const rootDir = path.join(process.cwd(), projectName);
  const { database, useJWT, useSocketIO, useDocker, useESLint, usePrettier } = options;
  
  const generators = [new ServerGenerator(rootDir, options)];

  if (options.database === "mongodb") generators.push(new MongoModelGenerator(rootDir, options));
  if (options.database === "postgres") generators.push(new PostgresGenerator(rootDir, options));
  if (options.useJWT) generators.push(new AuthGenerator(rootDir, options));
  if (options.useDocker) generators.push(new DockerGenerator(rootDir, options));
  if (options.useESLint) generators.push(new ESLintGenerator(rootDir, options));
  if (options.usePrettier) generators.push(new PrettierGenerator(rootDir, options));

  //CONFIGURE DEPENDENCIES
  let dependencies = {
    express: "^4.19.2",
    dotenv: "^16.4.5",
  };
  let devDependencies = {};
  let scripts = {
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
  
  //CREATE FILES

  //server.js
  await new ServerGenerator(rootDir, options).generate();

  //.env
  let envContent = "PORT=3000\n";
  if(database === "mongodb") envContent += "MONGO_URI=mongodb://localhost:27017/db-name\n";
  if(database === "postgres") envContent += "DATABASE_URL=postgresql://user:password@localhost:5432/dbname\n";
  if(useJWT) envContent += "JWT_SECRET=your_secret_key\n";
  await fs.writeFile(path.join(rootDir, ".env.example"), envContent);

  //gitignore
  await fs.writeFile(path.join(rootDir, ".gitignore"), "node_modules\n.env\n");

  //Mongodb (user model)
  if(database === "mongodb"){
    await new MongoModelGenerator(rootDir, options).generate();
  };

  //Postgres (Config, migration, repository)
  if(database === "postgres"){
    await new PostgresGenerator(rootDir, options).generate();
  }

  //auth (controller, route and middleware)
  if(useJWT){
    await new AuthGenerator(rootDir, options).generate();
  };

  //Docker files
  if(useDocker){
    await new DockerGenerator(rootDir, options).generate();
  };

  //ESLint
  if(useESLint){
    await new ESLintGenerator(rootDir, options).generate();
  };

  //Prettier
  if (usePrettier) {
    await new PrettierGenerator(rootDir, options).generate();
}
};

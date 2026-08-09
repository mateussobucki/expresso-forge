import fs from 'fs/promises';
import { version } from 'os';
import path from 'path';
import { start } from 'repl';
import { validateProjectName } from './validateProjectName.js';
import { ServerGenerator } from '../generators/serverGenerator.js';
import { MongoModelGenerator } from '../generators/mongoGenerator.js';
import { AuthGenerator } from '../generators/authGenerator.js';
import { DockerGenerator } from '../generators/dockerGenerator.js';
import { ESLintGenerator } from '../generators/ESLintGenerator.js';
import { PrettierGenerator } from '../generators/prettierGenerator.js';

export async function generateProject(projectName, options = {}){
  await validateProjectName(projectName);

  const rootDir = path.join(process.cwd(), projectName);
  const { useMongoDB, useJWT, useSocketIO, useDocker, useESLint, usePrettier } = options;
  
  //FOLDER STRUCTURE
  const folders = [
    'src/routes',
    'src/models',
    'src/controllers',
    'src/middlewares',
  ]
  
  for(const folder of folders){
    await fs.mkdir(path.join(rootDir, folder), { recursive: true });
  }
  
  const generators = [new ServerGenerator(rootDir, options)];

  if (options.useMongoDB) generators.push(new MongoModelGenerator(rootDir, options));
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
  if(useMongoDB) envContent += "MONGO_URI=mongodb://localhost:27017/db-name\n";
  if(useJWT) envContent += "JWT_SECRET=your_secret_key\n";
  await fs.writeFile(path.join(rootDir, ".env.example"), envContent);

  //gitignore
  await fs.writeFile(path.join(rootDir, ".gitignore"), "node_modules\n.env\n");

  //user model
  if(useMongoDB){
    await new MongoModelGenerator(rootDir, options).generate();
  };

  //auth routes and middleware
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

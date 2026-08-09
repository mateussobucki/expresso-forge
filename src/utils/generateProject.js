import fs from 'fs/promises';
import { version } from 'os';
import path from 'path';
import { start } from 'repl';
import { validateProjectName } from './validateProjectName.js';
import { buildServerJs } from '../templates/server.js';
import { buildUserModel } from '../templates/mongoModel.js';
import { buildAuthController, buildAuthMiddleware, buildAuthRoutes } from '../templates/auth.js';
import { buildDockerFile, buildDockerCompose, buildDockerignore } from '../templates/docker.js';
import { buildESLintConfig } from '../templates/ESLint.js';
import { buildPrettierConfig, buildPrettierIgnore } from '../templates/prettier.js';

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
  
  //CONFIGURE DEPENDENCIES
  const dependencies = {
    express: "^4.19.2",
    dotenv: "^16.4.5",
  };

  //mongoDB, jwt & socket.io
  if (useMongoDB) dependencies.mongoose = "^8.5.0";
  if (useJWT) {
    dependencies.jsonwebtoken = "^9.0.2";
    dependencies.bcrypt = "^5.1.1";
  };
  if (useSocketIO) dependencies["socket.io"] = "^4.7.5";

  //prettier & eslint
  const devDependencies = {};

  const scripts = {
    start: "node server.js",
    dev: "node --watch server.js",
  };

  if(useESLint) {
    devDependencies["eslint"] = "^9.9.0";
    devDependencies["@eslint/js"] = "^9.9.0";
  };
  
  if(useESLint){
    scripts.lint = "eslint .";
  };

  if(usePrettier){
    devDependencies["prettier"] = "^3.3.3";
  };

  if (usePrettier) {
    scripts.format = "prettier --write .";
  };

  if(useESLint && usePrettier){
    devDependencies["eslint-config-prettier"] = "^9.1.0";
  };

  //MOUNT PACKAGE.JSON
  const packageJson = {
    name: projectName,
    version: "1.0.0",
    type: "module",
    main: "server.js",
    scripts: scripts,
    dependencies,
    ...(Object.keys(devDependencies).length > 0 && { devDependencies }),
  };

  await fs.writeFile(
    path.join(rootDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
  
  //CREATE FILES

  //server.js
  const serverJs = buildServerJs(options);
  await fs.writeFile(path.join(rootDir, "server.js"), serverJs);

  //.env
  let envContent = "PORT=3000\n";
  if(useMongoDB) envContent += "MONGO_URI=mongodb://localhost:27017/db-name\n";
  if(useJWT) envContent += "JWT_SECRET=your_secret_key\n";
  await fs.writeFile(path.join(rootDir, ".env.example"), envContent);

  //gitignore
  await fs.writeFile(path.join(rootDir, ".gitignore"), "node_modules\n.env\n");

  //user model
  if(useMongoDB){
    await fs.writeFile(path.join(rootDir, "src/models/User.js"),
    buildUserModel(useJWT));
  };

  //auth routes and middleware
  if(useJWT){
    await fs.writeFile(path.join(rootDir, "src/controllers/authController.js"),
    buildAuthController());

    await fs.writeFile(path.join(rootDir, "src/routes/authRoutes.js"),
    buildAuthRoutes());

    await fs.writeFile(path.join(rootDir, "src/middlewares/auth.js"),
    buildAuthMiddleware());
  };

  //Docker files
  if(useDocker){
    await fs.writeFile(path.join(rootDir, "Dockerfile"), buildDockerFile());
    await fs.writeFile(path.join(rootDir, "docker-compose.yaml"), buildDockerCompose(options));
    await fs.writeFile(path.join(rootDir, ".dockerignore"), buildDockerignore());
  };

  //ESLint
  if(useESLint){
    await fs.writeFile(path.join(rootDir, "eslint.config.js"), buildESLintConfig());
  };

  //Prettier
  if (usePrettier) {
    await fs.writeFile(path.join(rootDir, ".prettierrc"), buildPrettierConfig());
    await fs.writeFile(path.join(rootDir, ".prettierignore"), buildPrettierIgnore());
}
};

import { execSync } from "child_process";

//run specified commands

export function installDependencies(rootDir){
  execSync("npm install", {cwd: rootDir, stdio: "ignore"});
};

export function initGitRepo(rootDir){
  execSync("git init", {cwd: rootDir, stdio: "ignore"});
  execSync("git add .", {cwd: rootDir, stdio: "ignore"});
  execSync('git commit -m "Initial commit"', {cwd: rootDir, stdio: "ignore"});
}
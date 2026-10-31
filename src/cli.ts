#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { generateProject } from "./utils/generateProject.js";
import { promptUser } from "./utils/promptUser.js";
import { buildOptionsFromFlags } from "./utils/buildOptionsFromFlags.js";
import { installDependencies, initGitRepo } from "./utils/postSetup.js";
import type { CreateFlags, ProjectOptions } from "./types.js";

// Read the version from package.json (one level above both src/ and dist/)
const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

const program = new Command();

program
  .name("expresso-forge-ts")
  .description("Interactive CLI to scaffold Node.js/Express projects with optional MongoDB, JWT, Socket.io, Docker, ESLint, and Prettier.")
  .version(version);

program
  .command("create <project-name>")
  .description("Creates a new express project")
  .option("--mongodb", "Include MongoDB configuration")
  .option("--postgres", "Include PostgreSQL configuration")
  .option("--jwt", "Include JWT authentication")
  .option("--socketio", "Include Socket.io configuration")
  .option("--docker", "Include Docker configuration")
  .option("--eslint", "Include ESLint configuration")
  .option("--prettier", "Include Prettier configuration")
  .option("--no-install", "Skip npm install")
  .option("--no-git", "Skip git init")
  .option("-y, --yes", "Skip prompts and use flags/defaults")
  .action(async (projectName: string, flags: CreateFlags) => {
    try {
      const options: ProjectOptions = flags.yes
        ? buildOptionsFromFlags(flags)
        : await promptUser();

      const rootDir = path.join(process.cwd(), projectName);
      const spinner = ora(`Creating project: ${projectName}...`).start();

      await generateProject(projectName, options);
      spinner.succeed(chalk.green(`Project ${projectName} was created successfully`));

      if (options.gitInit) {
        const gitSpinner = ora("Initializing git").start();
        initGitRepo(rootDir);
        gitSpinner.succeed(chalk.green("Git repository initialized"));
      }

      if (options.installDependencies) {
        const dependenciesSpinner = ora("Installing dependencies").start();
        installDependencies(rootDir);
        dependenciesSpinner.succeed(chalk.green("Dependencies installed"));
      }

      console.log(chalk.gray(`\nNext steps:`));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white(`  npm install (if not installed already)`));
      console.log(chalk.white(`  npm run dev`));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(chalk.red(`\nError: ${message}`));
      process.exit(1);
    }
  });

program.parse();

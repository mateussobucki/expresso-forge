#!/usr/bin/env node

import path from "path"
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { generateProject } from '../src/utils/generateProject.js'
import { promptUser } from '../src/utils/promptUser.js';
import { installDependencies, initGitRepo } from '../src/utils/postSetup.js';

const program = new Command();

program
  .name('express-cli')
  .description('Boilerplate generator')
  .version('1.0.0');

program
  .command('create <project-name>')
  .description('Creates a new express project')
  .action(async (projectName) => {
    try{
      const options = await promptUser();
      const rootDir = path.join(process.cwd(), projectName);
      const spinner = ora(`Creating project: ${projectName}...`).start();
      
      await generateProject(projectName, options);
      spinner.succeed(chalk.green(`Project ${projectName} was created successfully`));

      if(options.gitInit){
        const gitSpinner = ora("Initializing git").start();
        initGitRepo(rootDir);
        gitSpinner.succeed(chalk.green("Git repository initialized"));
      };

      if(options.installDependencies){
        const dependenciesSpinner = ora("Installing dependencies").start();
        installDependencies(rootDir);
        dependenciesSpinner.succeed(chalk.green("Dependencies installed"));
      }

      console.log(chalk.gray(`\nNext steps:`));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white(`  npm install (if not installed already)`));
      console.log(chalk.white(`  npm run dev`));
    } catch(err){
      console.error(chalk.red(`\nError: ${err.message}`));
      process.exit(1);
    }
  })

program.parse();


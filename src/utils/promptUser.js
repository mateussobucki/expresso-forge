import { input, confirm, select } from '@inquirer/prompts';
import chalk from 'chalk';

export async function promptUser(){
  const database = await select({
    message: chalk.yellow("Which database do you want to use?"),
    choices: [
      { name: "None", value: "none" },
      { name: "MongoDB", value: "mongodb" },
      { name: "PostgreSQL", value: "postgres" },
    ],
  });

  let useJWT = false;
  if(database !== "none"){
    useJWT = await confirm({
      message: chalk.yellow("Want to include JWT configuration?"),
      default: false,
    });
  }
  else{
    console.log(chalk.gray("(JWT authentication requires a database — skipping)"));
  }

  const useSocketIO = await confirm({
    message: chalk.yellow("Want to include SocketIO configuration?"),
    default: false,
  });

  const useDocker = await confirm({
    message: chalk.yellow("Want to include Docker configuration?"),
    default: false,
  });

  const useESLint = await confirm({
    message: chalk.yellow("Want to include ESLint configuration?"),
    default: false,
  });

  const usePrettier = await confirm({
    message: chalk.yellow("Want to include Prettier configuration?"),
    default: false,
  });

  const installDependencies = await confirm({
    message: chalk.yellow("Install dependencies now (npm install)?"),
    default: false,
  });

  const gitInit = await confirm({
    message: chalk.yellow("Initialize git repository? "),
    default: false,
  });

  return { database, useJWT, useSocketIO, useDocker, useESLint, usePrettier, installDependencies, gitInit };
};
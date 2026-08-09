import { input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

export async function promptUser(){
  const useMongoDB = await confirm({
    message: chalk.yellow("Want to include MongoDB configuration?"),
    default: false,
  });

  const useJWT = await confirm({
    message: chalk.yellow("Want to include JWT configuration?"),
    default: false,
  });

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

  return { useMongoDB, useJWT, useSocketIO, useDocker, useESLint, usePrettier, installDependencies, gitInit };
};
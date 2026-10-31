// Shared types for the CLI.

export type Database = "none" | "mongodb" | "postgres";

// Options that drive project generation (from prompts or CLI flags).
export interface ProjectOptions {
  database: Database;
  useJWT: boolean;
  useSocketIO: boolean;
  useDocker: boolean;
  useESLint: boolean;
  usePrettier: boolean;
  installDependencies: boolean;
  gitInit: boolean;
}

// Raw flags parsed by commander for the `create` command.
export interface CreateFlags {
  mongodb?: boolean;
  postgres?: boolean;
  jwt?: boolean;
  socketio?: boolean;
  docker?: boolean;
  eslint?: boolean;
  prettier?: boolean;
  install?: boolean;
  git?: boolean;
  yes?: boolean;
}

// Map of relative file path -> file content, returned by generators.
export type FileMap = Record<string, string>;

// Map of package name -> version range (dependencies / devDependencies).
export type DependencyMap = Record<string, string>;

// Map of npm script name -> command.
export type ScriptMap = Record<string, string>;

import type { CreateFlags, Database, ProjectOptions } from "../types.js";

export function buildOptionsFromFlags(flags: CreateFlags): ProjectOptions {
  const database: Database = flags.mongodb
    ? "mongodb"
    : flags.postgres
      ? "postgres"
      : "none";

  const useJWT = Boolean(flags.jwt);
  if (useJWT && database === "none") {
    throw new Error("JWT authentication requires a database. Pass --mongodb or --postgres along with --jwt.");
  }

  return {
    database,
    useJWT,
    useSocketIO: Boolean(flags.socketio),
    useDocker: Boolean(flags.docker),
    useESLint: Boolean(flags.eslint),
    usePrettier: Boolean(flags.prettier),
    installDependencies: flags.install !== false,
    gitInit: flags.git !== false,
  };
}

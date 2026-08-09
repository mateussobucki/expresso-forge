export function buildOptionsFromFlags(flags){
  return {
    useMongoDB: Boolean(flags.mongodb),
    useJWT: Boolean(flags.jwt),
    useSocketIO: Boolean(flags.socketio),
    useDocker: Boolean(flags.docker),
    useESLint: Boolean(flags.eslint),
    usePrettier: Boolean(flags.prettier),
    installDependencies: flags.install !== false,
    gitInit: flags.git !== false,
  };
};
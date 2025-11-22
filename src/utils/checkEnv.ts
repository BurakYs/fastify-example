type EnvironmentKey = keyof Bun.Env;

const requiredVariables: EnvironmentKey[] = ['BASE_URL', 'MONGODB_URI'];

export default function checkEnv() {
  const missingEnvVariables = requiredVariables.filter((env) => !process.env[env]);
  if (missingEnvVariables.length) {
    global.logger.fatal(`Missing environment variables: ${missingEnvVariables.join(', ')}`);
    process.exit(1);
  }
}

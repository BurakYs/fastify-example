type EnvironmentKeys = (keyof NodeJS.ProcessEnv)[];

export default function checkEnvironmentVariables() {
    const requiredEnvVariables: EnvironmentKeys = ['MONGO_URI'];
    const missingEnvVariables = requiredEnvVariables.filter((env) => !process.env[env]);

    if (missingEnvVariables.length) {
        global.logger.fatal(`Missing required environment variables: ${missingEnvVariables.join(', ')}`);
        process.exit(1);
    }
}

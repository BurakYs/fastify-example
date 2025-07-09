type EnvironmentKeys = (keyof NodeJS.ProcessEnv)[];

export default function checkEnv() {
    const requiredEnvVariables: EnvironmentKeys = ['BASE_URL', 'MONGODB_URI'];
    const missingEnvVariables = requiredEnvVariables.filter((env) => !process.env[env]);

    if (missingEnvVariables.length) {
        global.logger.fatal(`Missing required environment variables: ${missingEnvVariables.join(', ')}`);
        process.exit(1);
    }
}

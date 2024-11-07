import 'module-alias/register';
import 'dotenv/config';
import '@/utils/logger';

import Server from './server';

const requiredEnvVariables = ['MONGO_URI'];
const missingEnvVariables = requiredEnvVariables.filter((env) => !process.env[env]);
if (missingEnvVariables.length) {
    global.logger.fatal(`Missing required environment variables: ${missingEnvVariables.join(', ')}`);
    process.exit(1);
}

const server = new Server();
server.create()
    .catch(async (err) => {
        global.logger.error(err);
        await server.server.close();
    });

process.on('unhandledRejection', (error: unknown) => global.logger.error(error));
process.on('uncaughtException', (error: unknown) => global.logger.error(error));

export default server;
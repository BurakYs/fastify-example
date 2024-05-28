import 'module-alias/register';
import 'dotenv/config';
import { Logger } from '@/helpers';
import Server from './server';

global.logger = new Logger();

const requiredEnvVariables = ['MONGO_URI'];
const missingEnvVariables = requiredEnvVariables.filter((env) => !process.env[env]);
if (missingEnvVariables.length) {
    global.logger.fatal(`Missing required environment variables: ${missingEnvVariables.join(', ')}`);
    process.exit(1);
}

if (process.argv.includes('--production')) process.env.NODE_ENV = 'production';

const server = new Server();
if (process.env.NODE_ENV !== 'test') server.create()
    .then((port) => global.logger.info(`Server listening on http://localhost:${port}`))
    .catch(async (err) => {
        global.logger.error(err);
        await server.server.close();
    });

process.on('unhandledRejection', (error: unknown) => global.logger.error(error));
process.on('uncaughtException', (error: unknown) => global.logger.error(error));

export default server;
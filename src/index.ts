import 'module-alias/register';
import 'dotenv/config';
import { Logger } from '@/helpers';
import Server from './server';
import { existsSync, mkdirSync } from 'fs';

if (!existsSync('./logs')) mkdirSync('./logs');

if (process.argv.includes('--production')) process.env.NODE_ENV = 'production';

global.logger = new Logger();

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
import 'module-alias/register';
import 'dotenv/config';
import '@/utils/logger';

import Server from './server';
import checkEnvironmentVariables from '@/utils/checkEnvironmentVariables';
import mongoose from 'mongoose';

checkEnvironmentVariables();

const server = new Server();
server.create()
    .then(() => {
        ['SIGINT', 'SIGTERM'].forEach((signal) => {
            process.on(signal, async () => {
                await server.server.close();
                await mongoose.disconnect();
                process.exit(0);
            });
        });
    })
    .catch(async (err) => {
        global.logger.error(err);
        await server.server.close();
        process.exit(1);
    });

process.on('unhandledRejection', (error) => global.logger.error(error));
process.on('uncaughtException', (error) => global.logger.error(error));

export default server;
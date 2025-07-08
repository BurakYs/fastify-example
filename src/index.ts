import 'dotenv/config';
import '@/utils/setupLogger';

import mongoose from 'mongoose';
import Server from '@/server';
import checkEnvironmentVariables from '@/utils/checkEnvironmentVariables';

checkEnvironmentVariables();

const server = new Server();
server
    .create()
    .then(() => {
        const terminationSignals = ['SIGINT', 'SIGTERM'];

        for (const signal of terminationSignals) {
            process.on(signal, async () => {
                await server.server.close();
                await mongoose.disconnect();
                process.exit(0);
            });
        }
    })
    .catch(async (err) => {
        global.logger.error(err);
        await server.server.close();
        process.exit(1);
    });

process.on('unhandledRejection', (error) => global.logger.error(error));
process.on('uncaughtException', (error) => global.logger.error(error));

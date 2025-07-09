import '@/bootstrap';
import mongoose from 'mongoose';
import Server from '@/server';

const server = new Server();
server
    .create()
    .then(() => {
        const terminationSignals = ['SIGINT', 'SIGTERM'];

        for (const signal of terminationSignals) {
            process.on(signal, async () => {
                await server.fastify.close();
                await mongoose.disconnect();
            });
        }
    })
    .catch(async (err) => {
        global.logger.error(err);
        await server.fastify.close();
        await mongoose.disconnect();
        process.exit(1);
    });

process.on('unhandledRejection', (error) => global.logger.error(error));
process.on('uncaughtException', (error) => global.logger.error(error));

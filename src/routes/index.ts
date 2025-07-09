import mongoose from 'mongoose';
import createRouter from '@/utils/createRouter';

export default createRouter(async (fastify) => {
    fastify.route({
        method: 'GET',
        url: '/',
        handler: async (_request, response) => {
            response.sendSuccess(200, 'Hello, world!');
        }
    });

    fastify.route({
        method: 'GET',
        url: '/healthz',
        handler: async (_request, response) => {
            try {
                // biome-ignore lint/style/noNonNullAssertion: If the connection isn't established this will throw
                await mongoose.connection.db!.admin().ping();
                response.code(200).send('OK');
            } catch {
                response.code(503).send('Service Unavailable');
            }
        }
    });
});

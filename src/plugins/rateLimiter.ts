import fastifyRateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
    fastify.register(fastifyRateLimit, {
        global: true,
        max: 50,
        timeWindow: 60000,
        hook: 'onRequest',
        skipOnError: false
    });
});

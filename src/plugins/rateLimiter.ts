import fastifyRateLimit, { type RateLimitPluginOptions } from '@fastify/rate-limit';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
    fastify.register(fastifyRateLimit, {
        global: true,
        max: 50,
        timeWindow: 60000,
        hook: 'preParsing',
        keyGenerator: (request) => request.clientIp,
        skipOnError: false
    } satisfies RateLimitPluginOptions);
});

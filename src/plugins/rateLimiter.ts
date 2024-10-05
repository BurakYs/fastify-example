import fp from 'fastify-plugin';
import fastifyRateLimit, { type RateLimitPluginOptions } from '@fastify/rate-limit';

export default fp(async (fastify) => {
    fastify.register(fastifyRateLimit, {
        global: true,
        max: 50,
        timeWindow: 60000,
        hook: 'preParsing',
        allowList: ['127.0.0.1'],
        keyGenerator: (request) => request.clientIp,
        skipOnError: false,
        addHeadersOnExceeding: {
            'x-ratelimit-limit': false,
            'x-ratelimit-remaining': false,
            'x-ratelimit-reset': true
        },
        addHeaders: {
            'x-ratelimit-limit': false,
            'x-ratelimit-remaining': true,
            'x-ratelimit-reset': false,
            'retry-after': false
        }
    } satisfies RateLimitPluginOptions);
});
import type { FastifyInstance } from 'fastify';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/',
        schema: {
            hide: true
        },
        handler: async (_request, response) => {
            response.code(200).send('OK');
        }
    });
};

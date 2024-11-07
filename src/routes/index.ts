import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/',
        schema: {
            hide: true
        },
        handler: async (_request: FastifyRequest, response: FastifyReply) => {
            response.code(200).send('OK');
        }
    });
};

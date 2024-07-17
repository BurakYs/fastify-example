import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';

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

    fastify.route({
        method: 'GET',
        url: '/favicon.ico',
        schema: {
            hide: true
        },
        handler: async (_request: FastifyRequest, response: FastifyReply) => {
            response.header('Cache-Control', 'public, max-age=2592000');
            response.code(200).send(fs.readFileSync('./public/favicon.ico'));
        }
    });
};

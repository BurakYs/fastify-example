import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import type { QueryTest } from '@/schemas/zod';
import { queryTest } from '@/schemas/zod';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/query',
        schema: {
            summary: 'Test query validation',
            tags: ['Zod'],
            querystring: queryTest
        },
        handler: async (request: FastifyRequest, response: FastifyReply) => {
            const query = request.query as QueryTest;
            response.sendSuccess(query, 200);
        }
    });
};
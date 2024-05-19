import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
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
        handler: async (request: Request, response: Response) => {
            const query = request.query as QueryTest;
            response.sendSuccess(query, 200);
        }
    });
};
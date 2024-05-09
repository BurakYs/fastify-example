import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import { QuerySchema, BodySchema, ParamsSchema } from '@/schemas/zod';
import type { QueryType, BodyType, ParamsType } from '@/schemas/zod';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/query',
        schema: {
            summary: 'Test query schema validation',
            tags: ['Zod'],
            querystring: QuerySchema
        },
        handler: async (request: Request, response: Response) => {
            const query = request.query as QueryType;
            response.sendSuccess(query, 200);
            return;
        }
    });

    fastify.route({
        method: 'POST',
        url: '/body',
        schema: {
            summary: 'Test body schema validation',
            tags: ['Zod'],
            body: BodySchema
        },
        handler: async (request: Request, response: Response) => {
            const body = request.body as BodyType;
            response.sendSuccess(body, 200);
            return;
        }
    });

    fastify.route({
        method: 'GET',
        url: '/params/:id',
        schema: {
            summary: 'Test params schema validation',
            tags: ['Zod'],
            params: ParamsSchema
        },
        handler: async (request: Request, response: Response) => {
            const params = request.params as ParamsType;
            response.sendSuccess(params, 200);
            return;
        }
    });
};
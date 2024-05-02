import { Request, Response } from '@/interfaces';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export default (fastify: FastifyInstance, opts: any, done: any) => {
    fastify.route({
        method: 'GET',
        url: '/query',
        schema: {
            querystring: z.object({
                hello: z.string().min(3).max(10)
            })
        },
        handler: async (request: Request, response: Response) => {
            response.sendSuccess(request.query, 200);
            return;
        }
    });

    fastify.route({
        method: 'POST',
        url: '/body',
        schema: {
            body: z.object({
                hello: z.string().min(3).max(10)
            })
        },
        handler: async (request: Request, response: Response) => {
            response.sendSuccess(request.body, 200);
            return;
        }
    });

    fastify.route({
        method: 'GET',
        url: '/params/:id',
        schema: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        handler: async (request: Request, response: Response) => {
            response.sendSuccess(request.params, 200);
            return;
        }
    });

    done();
};
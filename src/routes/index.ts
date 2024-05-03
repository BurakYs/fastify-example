import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import fs from 'fs';

export default (fastify: FastifyInstance, opts: any, done: any) => {
    fastify.route({
        method: 'GET',
        url: '/',
        schema: {
            hide: true
        },
        handler: async (request: Request, response: Response) => {
            response.code(200).send('ok');
            return;
        }
    });

    fastify.route({
        method: 'GET',
        url: '/favicon.ico',
        schema: {
            hide: true
        },
        handler: async (request: Request, response: Response) => {
            response.code(200).send(fs.readFileSync('./public/favicon.ico'));
            return;
        }
    });

    done();
};
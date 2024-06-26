import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import { generateSlug } from '@/helpers';
import { checkDbConnection } from '@/middlewares';
import URL from '@/models/URL';
import appConfig from '@/config/app';

import { urlCreate, urlDelete, urlRedirect } from '@/schemas/url';
import type { URLCreate, URLDelete, URLRedirect } from '@/schemas/url';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/:slug',
        schema: {
            summary: 'Redirect to the original URL',
            tags: ['URL'],
            params: urlRedirect
        },
        preHandler: [checkDbConnection],
        handler: async (request: Request, response: Response) => {
            const params = request.params as URLRedirect;

            const url = await URL.findOne({ slug: params.slug });
            if (!url) {
                response.sendError('URL not found', 404);
                return;
            }

            response.code(301).redirect(url.url);
        }
    });

    fastify.route({
        method: 'POST',
        url: '/shorten',
        schema: {
            summary: 'Shorten a URL',
            tags: ['URL'],
            body: urlCreate
        },
        preHandler: [checkDbConnection],
        handler: async (request: Request, response: Response) => {
            const body = request.body as URLCreate;
            const slug = generateSlug();

            await URL.create({
                url: body.url,
                slug,
                createdBy: request.clientIp
            });

            response.sendSuccess({
                url: appConfig.rootUrl + '/url/' + slug,
                slug
            }, 201);
        }
    });

    fastify.route({
        method: 'DELETE',
        url: '/:slug',
        schema: {
            summary: 'Delete a short URL',
            tags: ['URL'],
            params: urlDelete
        },
        preHandler: [checkDbConnection],
        handler: async (request: Request, response: Response) => {
            const params = request.params as URLDelete;

            const url = await URL.findOne({ slug: params.slug });
            if (!url) {
                response.sendError('URL not found', 404);
                return;
            }

            if (url.createdBy !== request.clientIp) {
                response.sendError('Unauthorized', 401);
                return;
            }

            await url.deleteOne();
            response.code(204).send();
        }
    });
};
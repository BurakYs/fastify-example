import { FastifyInstance } from 'fastify';
import { Request, Response } from '@/interfaces';
import URL from '@/models/URL';
import { URLCreate, URLCreateT, URLDelete, URLDeleteT, URLRedirect, URLRedirectT } from '@/schemas/url';
import { generateSlug } from '@/helpers';
import { checkDbConnection } from '@/middlewares';
import appConfig from '@/config/app';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'POST',
        url: '/shorten',
        schema: {
            summary: 'Shorten a URL',
            tags: ['URL'],
            body: URLCreate
        },
        preHandler: [checkDbConnection],
        handler: async (request: Request, response: Response) => {
            const body = request.body as URLCreateT;
            const slug = generateSlug();

            await new URL({
                url: body.url,
                slug,
                createdBy: request.clientIp
            }).save();

            response.sendSuccess({
                url: appConfig.rootUrl + '/url/' + slug,
                slug
            }, 201);
            return;
        }
    });

    fastify.route({
        method: 'GET',
        url: '/:slug',
        schema: {
            summary: 'Redirect to the original URL',
            tags: ['URL'],
            params: URLRedirect
        },
        preHandler: [checkDbConnection],
        handler: async (request: Request, response: Response) => {
            const params = request.params as URLRedirectT;

            const url = await URL.findOne({ slug: params.slug });
            if (!url) {
                response.sendError('URL not found', 404);
                return;
            }

            response.code(301).redirect(url.url);
            return;
        }
    });

    fastify.route({
        method: 'DELETE',
        url: '/:slug',
        schema: {
            summary: 'Delete a short URL',
            tags: ['URL'],
            params: URLDelete
        },
        preHandler: [checkDbConnection],
        handler: async (request: Request, response: Response) => {
            const params = request.params as URLDeleteT;

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
            return;
        }
    });
};
import type { FastifyInstance } from 'fastify';
import appConfig from '@/config/app';
import URL from '@/models/URL';
import type { URLCreate, URLDelete, URLRedirect } from '@/schemas/url';
import { urlCreate, urlDelete, urlRedirect } from '@/schemas/url';
import generateRandomString from '@/utils/generateRandomString';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/:slug',
        schema: {
            summary: 'Redirect to the original URL',
            tags: ['URL'],
            params: urlRedirect
        },
        handler: async (request, response) => {
            const params = request.params as URLRedirect;

            const url = await URL.findOne({ slug: params.slug });
            if (!url) return response.sendError(404, 'URL not found');

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
        handler: async (request, response) => {
            const body = request.body as URLCreate;
            const slug = generateRandomString();

            await URL.create({
                url: body.url,
                slug,
                createdBy: request.ip
            });

            response.sendSuccess(201, {
                url: `${appConfig.rootUrl}/url/${slug}`,
                slug
            });
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
        handler: async (request, response) => {
            const params = request.params as URLDelete;

            const url = await URL.findOne({ slug: params.slug });
            if (!url) return response.sendError(404, 'URL not found');

            if (url.createdBy !== request.ip) return response.sendError(401, 'Unauthorized');

            await url.deleteOne();
            response.code(204).send();
        }
    });
};

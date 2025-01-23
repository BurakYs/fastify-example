import type { FastifyInstance } from 'fastify';
import checkDbConnection from '@/middlewares/checkDbConnection';
import generateRandomString from '@/utils/generateRandomString';
import URL from '@/models/URL';
import appConfig from '@/config/app';

import type { URLCreate, URLDelete, URLRedirect } from '@/schemas/url';
import { urlCreate, urlDelete, urlRedirect } from '@/schemas/url';

export default async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/:slug',
        schema: {
            summary: 'Redirect to the original URL',
            tags: ['URL'],
            params: urlRedirect
        },
        preValidation: [checkDbConnection],
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
        preValidation: [checkDbConnection],
        handler: async (request, response) => {
            const body = request.body as URLCreate;
            const slug = generateRandomString();

            await URL.create({
                url: body.url,
                slug,
                createdBy: request.clientIp
            });

            response.sendSuccess(201, {
                url: appConfig.rootUrl + '/url/' + slug,
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
        preValidation: [checkDbConnection],
        handler: async (request, response) => {
            const params = request.params as URLDelete;

            const url = await URL.findOne({ slug: params.slug });
            if (!url) return response.sendError(404, 'URL not found');

            if (url.createdBy !== request.clientIp) return response.sendError(401, 'Unauthorized');

            await url.deleteOne();
            response.code(204).send();
        }
    });
};
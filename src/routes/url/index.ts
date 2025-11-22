import URL from '@/models/URL';
import { urlCreateBody, urlDeleteParams, urlRedirectParams } from '@/schemas/url';
import createRouter from '@/utils/createRouter';
import generateRandomString from '@/utils/generateRandomString';

export default createRouter(async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/:slug',
    schema: {
      summary: 'Redirect to the original URL',
      tags: ['URL'],
      params: urlRedirectParams
    },
    handler: async (request, response) => {
      const { params } = request;

      const url = await URL.findOne({ slug: params.slug });
      if (!url) return response.sendError(404, 'URL not found');

      response.code(301).redirect(url.url);
    }
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      summary: 'Shorten a URL',
      tags: ['URL'],
      body: urlCreateBody
    },
    handler: async (request, response) => {
      const { body } = request;
      const slug = generateRandomString();

      await URL.create({
        url: body.url,
        slug,
        createdBy: request.ip
      });

      response.sendSuccess(201, {
        url: `${process.env.BASE_URL}/url/${slug}`,
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
      params: urlDeleteParams
    },
    handler: async (request, response) => {
      const { params } = request;

      const url = await URL.findOne({ slug: params.slug });
      if (!url) return response.sendError(404, 'URL not found');

      if (url.createdBy !== request.ip) return response.sendError(401, 'Unauthorized');

      await url.deleteOne();
      response.code(204).send();
    }
  });
});

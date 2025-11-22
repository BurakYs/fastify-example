import { nanoid } from 'nanoid';
import URL from '@/models/URL';
import { createUrlBody, deleteUrlParams, getUrlParams } from '@/schemas/url';
import createRouter from '@/utils/createRouter';

export default createRouter(async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/:slug',
    schema: {
      summary: 'Redirect to the original URL',
      tags: ['URL'],
      params: getUrlParams
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
      body: createUrlBody
    },
    handler: async (request, response) => {
      const { body } = request;
      const slug = nanoid(8);

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
      params: deleteUrlParams
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

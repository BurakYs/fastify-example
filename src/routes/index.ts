import createRouter from '@/utils/createRouter';

export default createRouter(async (fastify) => {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      hide: true
    },
    handler: async (_request, response) => {
      response.sendSuccess(200, 'Hello, world!');
    }
  });
});

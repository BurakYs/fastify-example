import path from 'node:path';
import fastifyStaticServer from '@fastify/static';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.register(fastifyStaticServer, {
    root: path.join(process.cwd(), 'public')
  });
});

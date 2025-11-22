import type Server from '@/server';

export default function createRouter(router: (fastify: Server['fastify']) => Promise<void>) {
  return router;
}

import type Server from '@/server';

export default function createRouter(router: (fastify: Server['server']) => Promise<void>) {
    return router;
}

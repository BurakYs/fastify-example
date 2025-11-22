import '@/bootstrap';
import { afterAll, beforeAll } from 'vitest';
import Server from '@/server';

const server = new Server();
const fastify = server.fastify;

beforeAll(async () => {
    await server.start();
    await fastify.ready();
});

afterAll(async () => {
    await server.shutdown();
});

export default fastify;

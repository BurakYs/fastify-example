import '@/bootstrap';
import { afterAll, beforeAll } from 'bun:test';
import Server from '@/server';

const server = new Server();
const fastify = server.fastify;

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.shutdown();
});

export default fastify;

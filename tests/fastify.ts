import '@/bootstrap';
import mongoose from 'mongoose';
import { afterAll, beforeAll } from 'vitest';
import Server from '@/server';

const server = new Server();
const fastify = server.fastify;

beforeAll(async () => {
    await server.create();
    await fastify.ready();
});

afterAll(async () => {
    await fastify.close();
    await mongoose.disconnect();
});

export default fastify;

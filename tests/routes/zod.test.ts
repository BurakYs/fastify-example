import { afterAll, beforeAll, expect, test } from 'vitest';
import server from '../../src/index';

beforeAll(async () => {
    await server.create();
});

const fastify = server.server;

test('Test invalid parameters', async () => {
    const response = await fastify.inject({
        method: 'GET',
        url: '/zod/query'
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().validationFailures?.length).toBe(1);
});

test('Test query parameters', async () => {
    const response = await fastify.inject({
        method: 'GET',
        url: '/zod/query?hello=world'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data?.hello).toBe('world');
});

test('Test body parameters', async () => {
    const response = await fastify.inject({
        method: 'POST',
        url: '/zod/body',
        payload: {
            hello: 'world'
        }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data?.hello).toBe('world');
});

test('Test params parameters', async () => {
    const id = 'f01643f4-34d0-4ec6-8b81-a96041fe65c0';

    const response = await fastify.inject({
        method: 'GET',
        url: '/zod/params/' + id
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data?.id).toBe(id);
});

afterAll(async () => {
    await fastify.close();
});
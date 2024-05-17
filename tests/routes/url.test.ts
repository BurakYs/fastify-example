import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import server from '../../src/index';

beforeAll(async () => {
    await server.create();
});

const fastify = server.server;

let slug: string;

describe('Test URL routes', () => {
    test('Create a new URL', async () => {
        const response = await fastify.inject({
            method: 'POST',
            url: '/url/shorten',
            payload: {
                url: 'https://google.com'
            }
        });

        const slugRes = response.json().data.slug;
        expect(response.statusCode).toBe(201);
        expect(response.json().data.url).toBe('http://localhost:3000/url/' + slugRes);
        slug = slugRes;
    });

    test('Redirect to the original URL', async () => {
        test.skipIf(!slug);

        const response = await fastify.inject({
            method: 'GET',
            url: '/url/' + slug
        });

        expect(response.statusCode).toBe(301);
        expect(response.headers.location).toBe('https://google.com');
    });

    test('Delete the URL', async () => {
        test.skipIf(!slug);

        const response = await fastify.inject({
            method: 'DELETE',
            url: '/url/' + slug
        });

        expect(response.statusCode).toBe(204);
    });

    afterAll(async () => {
        await fastify.close();
    });
});
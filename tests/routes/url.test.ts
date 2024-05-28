import { describe, expect, test } from 'vitest';
import fastify from '../setup';

describe('Test URL routes', () => {
    let slug: string;

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
        const response = await fastify.inject({
            method: 'GET',
            url: '/url/' + slug
        });

        expect(response.statusCode).toBe(301);
        expect(response.headers.location).toBe('https://google.com');
    });

    test('Delete the URL', async () => {
        const response = await fastify.inject({
            method: 'DELETE',
            url: '/url/' + slug
        });

        expect(response.statusCode).toBe(204);
    });
});
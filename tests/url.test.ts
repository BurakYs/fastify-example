import { describe, expect, it } from 'bun:test';
import fastify from '@/tests/fastify';

describe('URL Routes', () => {
  const longUrl = 'https://example.com';
  let createdSlug = '';

  it('should shorten URL', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/url',
      payload: { url: longUrl }
    });

    expect(response.statusCode).toBe(201);

    const json = response.json();
    expect(json).toHaveProperty('url');
    expect(json).toHaveProperty('slug');
    expect(json.url).toContain(json.slug);

    createdSlug = json.slug;
  });

  it('should return 400 when url is missing', async () => {
    const res = await fastify.inject({
      method: 'POST',
      url: '/url',
      payload: {}
    });

    expect(res.statusCode).toBe(400);

    const json = res.json();
    expect(json.validationFailures[0].path).toBe('url');
  });

  it('should redirect to original URL', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: `/url/${createdSlug}`
    });

    expect(response.statusCode).toBe(301);
    expect(response.headers.location).toBe(longUrl);
  });

  it('should return 404 on GET with non-existing slug', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/url/nonexistentslug'
    });

    expect(response.statusCode).toBe(404);
  });

  it('should return 401 when a different user tries to delete the URL', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: `/url/${createdSlug}`,
      remoteAddress: '1.1.1.1'
    });

    expect(response.statusCode).toBe(401);
  });

  it('should allow the original user to delete the URL', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: `/url/${createdSlug}`
    });

    expect(response.statusCode).toBe(204);
  });

  it('should return 404 on DELETE of deleted slug', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: `/url/${createdSlug}`
    });

    expect(response.statusCode).toBe(404);
    expect(response.json() as { error: string }).toEqual({ error: 'URL not found' });
  });
});

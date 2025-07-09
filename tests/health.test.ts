import { expect, test } from 'vitest';
import fastify from '@/tests/fastify';

test('Health check', async () => {
    const res = await fastify.inject('/healthz');
    expect(res.statusCode).toBe(200);
});

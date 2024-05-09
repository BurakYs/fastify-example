import 'module-alias/register';

import server from '../../src/index';
import tap from 'tap';

const fastify = server.server;

tap.test('Test invalid parameters', async (t) => {
    const response = await fastify.inject({
        method: 'GET',
        url: '/zod/query'
    });

    t.equal(response.statusCode, 400);
    t.equal(response.json().validationFailures?.length, 1);
});

tap.test('Test query parameters', async (t) => {
    const response = await fastify.inject({
        method: 'GET',
        url: '/zod/query?hello=world'
    });

    t.equal(response.statusCode, 200);
    t.equal(response.json().data?.hello, 'world');
});

tap.test('Test body parameters', async (t) => {
    const response = await fastify.inject({
        method: 'POST',
        url: '/zod/body',
        payload: {
            hello: 'world'
        }
    });

    t.equal(response.statusCode, 200);
    t.equal(response.json().data?.hello, 'world');
});

tap.test('Test params parameters', async (t) => {
    const id = 'f01643f4-34d0-4ec6-8b81-a96041fe65c0';

    const response = await fastify.inject({
        method: 'GET',
        url: '/zod/params/' + id
    });

    t.equal(response.statusCode, 200);
    t.equal(response.json().data?.id, id);
});

tap.teardown( () => {
    fastify.close();
});
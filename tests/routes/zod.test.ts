import { describe, expect, test } from 'vitest';
import fastify from '../setup';

describe('Test Zod validation', () => {
    test('Test required fields', async () => {
        const query = {
            name: 'John Doe'
        };

        const response = await fastify.inject({
            method: 'GET',
            url: '/zod/query?' + new URLSearchParams(query).toString()
        });

        const failures = response.json().validationFailures;
        expect(response.statusCode).toBe(400);
        expect(failures).toHaveLength(1);
        expect(failures[0].message).toBe('Required');
    });

    test('Test invalid number type', async () => {
        const query = {
            name: 'John Doe',
            age: 'NaN'
        };

        const response = await fastify.inject({
            method: 'GET',
            url: '/zod/query?' + new URLSearchParams(query).toString()
        });

        const failures = response.json().validationFailures;
        expect(response.statusCode).toBe(400);
        expect(failures).toHaveLength(1);
        expect(failures[0].message).toBe('Expected number, received string');
    });

    test('Test invalid boolean type', async () => {
        const query = {
            name: 'John Doe',
            age: '20',
            human: 'no'
        };

        const response = await fastify.inject({
            method: 'GET',
            url: '/zod/query?' + new URLSearchParams(query).toString()
        });

        const failures = response.json().validationFailures;
        expect(response.statusCode).toBe(400);
        expect(failures).toHaveLength(1);
        expect(failures[0].message).toBe('Expected boolean, received string');
    });

    test('Test valid query', async () => {
        const query = {
            name: 'John Doe',
            age: '20',
            human: 'true'
        };

        const response = await fastify.inject({
            method: 'GET',
            url: '/zod/query?' + new URLSearchParams(query).toString()
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().data).toEqual({
            name: 'John Doe',
            age: 20,
            human: true
        });
    });
});
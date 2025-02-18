import fp from 'fastify-plugin';
import { ZodDefault, ZodNullable, ZodOptional, type ZodTypeAny, z } from 'zod';

export default fp(async (fastify) => {
    fastify.addHook('preValidation', async (request) => {
        const routeSchema = request.routeOptions?.schema?.querystring;

        if (routeSchema && routeSchema instanceof z.ZodObject) {
            const queryParamsSchema = routeSchema.shape;

            for (const key in queryParamsSchema) {
                const originalSchema = queryParamsSchema[key];
                const paramSchema = unwrapSchema(originalSchema);

                const requestQuery = request.query as Record<string, unknown>;
                const value = requestQuery[key];

                if (value != null) {
                    requestQuery[key] = validateValue(paramSchema, value);
                } else {
                    const func = originalSchema._def.defaultValue;
                    const defaultValue = typeof func === 'function' ? func() : undefined;

                    if (defaultValue != null) {
                        requestQuery[key] = defaultValue;
                    }
                }
            }
        }
    });
});

function unwrapSchema(schema: ZodTypeAny): ZodTypeAny {
    while (schema instanceof ZodDefault || schema instanceof ZodOptional || schema instanceof ZodNullable) {
        schema = schema._def.innerType;
    }
    return schema;
}

function validateValue(paramSchema: ZodTypeAny, value: unknown): unknown {
    if (paramSchema instanceof z.ZodBoolean) {
        value = value === 'true' ? true : value === 'false' ? false : value;
    }

    if (paramSchema instanceof z.ZodNumber) {
        const number = Number(value);
        if (!Number.isNaN(number)) value = number;
    }

    if (paramSchema instanceof z.ZodArray) {
        if (typeof value === 'string') {
            value = value.split(',').map((item) => validateValue(unwrapSchema(paramSchema._def.type), item));
        }
    }

    return value;
}

import fp from 'fastify-plugin';
import { z, ZodDefault, ZodNullable, ZodOptional, ZodTypeAny } from 'zod';

export default fp(async (fastify) => {
    fastify.addHook('preValidation', async (request) => {
        const routeSchema = request.routeOptions?.schema?.querystring;
        if (!routeSchema || !(routeSchema instanceof z.ZodObject)) return;

        const schemaShape = routeSchema.shape;

        for (const key in schemaShape) {
            const originalSchema = schemaShape[key];
            const paramSchema = unwrapSchema(originalSchema);
            const requestQuery = request.query as Record<string, unknown>;
            const value = requestQuery[key];
            const isProvided = value != null;

            if (isProvided) {
                if (paramSchema instanceof z.ZodBoolean) {
                    requestQuery[key] = value === 'true' ? true : value === 'false' ? false : value;
                }

                if (paramSchema instanceof z.ZodNumber) {
                    if (!Number.isNaN(value)) {
                        requestQuery[key] = Number(value);
                    }
                }

                if (paramSchema instanceof z.ZodArray) {
                    if (typeof value === 'string') {
                        requestQuery[key] = value.split(',').map((item) => {
                            const arraySchema = unwrapSchema(paramSchema._def.type);

                            if (arraySchema instanceof z.ZodNumber) {
                                return Number.isNaN(item) ? item : Number(item);
                            } else if (arraySchema instanceof z.ZodBoolean) {
                                return item === 'true' ? true : item === 'false' ? false : item;
                            } else {
                                return item;
                            }
                        });
                    }
                }
            } else {
                const func = originalSchema._def.defaultValue;
                const defaultValue = typeof func === 'function' ? func() : undefined;

                if (defaultValue != null) {
                    requestQuery[key] = defaultValue;
                }
            }
        }
    });
});

function unwrapSchema(schema: ZodTypeAny): ZodTypeAny {
    while (
        schema instanceof ZodDefault ||
        schema instanceof ZodOptional ||
        schema instanceof ZodNullable
        ) {
        schema = schema._def.innerType;
    }

    return schema;
}
import fp from 'fastify-plugin';
import { z } from 'zod';

export default fp(async (fastify) => {
  fastify.addHook('preValidation', async (request) => {
    const routeSchema = request.routeOptions.schema?.querystring;
    if (!(routeSchema instanceof z.ZodObject)) return;

    const query = request.query as Record<string, unknown>;

    for (const key of Object.keys(query)) {
      let schema = routeSchema.shape[key] as z.ZodType | undefined;
      if (!schema) continue;

      while (schema instanceof z.ZodDefault || schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
        schema = schema.def.innerType as z.ZodType;
      }

      const data = query[key];
      if (typeof data !== 'string') continue;

      query[key] = validateValue(schema, data);
    }
  });
});

function validateValue(schema: z.ZodType, value: string): unknown {
  if (schema instanceof z.ZodBoolean) {
    return value === 'true' ? true : value === 'false' ? false : value;
  }

  if (schema instanceof z.ZodNumber) {
    const number = Number(value);
    return Number.isNaN(number) ? value : number;
  }

  if (schema instanceof z.ZodArray) {
    const itemSchema = schema.element as z.ZodType;
    return value.split(',').map((item) => validateValue(itemSchema, item));
  }

  if (schema instanceof z.ZodEnum) {
    return schema.options.includes(value) ? value : value;
  }

  if (schema instanceof z.ZodDate) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date;
  }

  return value;
}
